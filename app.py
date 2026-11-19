import json
import os
import re
import sqlite3
import time
import urllib.request
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, g, current_app

DEFAULT_DATABASE = os.path.join(os.path.dirname(__file__), 'instance', 'messages.db')
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'portfolio.json')
FALLBACK_CONTRIBUTIONS_FILE = os.path.join(os.path.dirname(__file__), 'data', 'github_contributions_fallback.json')
CACHE_CONTRIBUTIONS_FILE = os.path.join(os.path.dirname(__file__), 'instance', 'github_contributions_cache.json')
CACHE_TTL_SECONDS = 3600  # 1 hour cache TTL


def get_cached_github_contributions(username='bam841', force_refresh=False):
    """
    Retrieves live GitHub contribution statistics for the given username.
    Implements a 1-hour cache and falls back smoothly to offline/cached data.
    """
    # 1. Try returning fresh cache
    if not force_refresh and os.path.exists(CACHE_CONTRIBUTIONS_FILE):
        try:
            mtime = os.path.getmtime(CACHE_CONTRIBUTIONS_FILE)
            if time.time() - mtime < CACHE_TTL_SECONDS:
                with open(CACHE_CONTRIBUTIONS_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception:
            pass

    # 2. Try fetching live data from GitHub contributions proxy API
    api_url = f"https://github-contributions-api.jogruber.de/v4/{username}"
    try:
        req = urllib.request.Request(
            api_url,
            headers={'User-Agent': 'BamPortfolio/2.0 (Flask-Backend)'}
        )
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            if resp.status == 200:
                payload = json.loads(resp.read().decode('utf-8'))
                if payload and 'contributions' in payload:
                    payload['source'] = 'live'
                    payload['cached_at'] = datetime.now(timezone.utc).isoformat()
                    os.makedirs(os.path.dirname(CACHE_CONTRIBUTIONS_FILE), exist_ok=True)
                    with open(CACHE_CONTRIBUTIONS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(payload, f)
                    return payload
    except Exception:
        pass

    # 3. If live fetch failed but we have existing cache (even stale), return it
    if os.path.exists(CACHE_CONTRIBUTIONS_FILE):
        try:
            with open(CACHE_CONTRIBUTIONS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data['source'] = 'cached_stale'
                return data
        except Exception:
            pass

    # 4. Fallback to bundled dataset
    if os.path.exists(FALLBACK_CONTRIBUTIONS_FILE):
        with open(FALLBACK_CONTRIBUTIONS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            data['source'] = 'bundled_fallback'
            return data

    return {'total': {'2026': 331}, 'contributions': []}


def get_db():
    """Opens a new database connection if there is none yet for the current application context."""
    if 'db' not in g:
        db_path = current_app.config['DATABASE']
        os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    """Closes the database again at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db(app):
    """Initializes the SQLite schema for contact messages."""
    db_path = app.config['DATABASE']
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                services TEXT,
                budget TEXT,
                brief TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')
        conn.commit()
    finally:
        conn.close()


def load_portfolio_data():
    """Loads portfolio configuration from the JSON data store."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def create_app(test_config=None):
    """Application factory for the portfolio application."""
    app = Flask(
        __name__,
        static_folder='static',
        template_folder='templates'
    )
    
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-bam-portfolio-key-2026'),
        DATABASE=DEFAULT_DATABASE,
    )

    if test_config:
        app.config.update(test_config)

    # Register teardown
    app.teardown_appcontext(close_db)

    # Global template context processor
    @app.context_processor
    def inject_global_data():
        data = load_portfolio_data()
        return {
            'profile': data.get('profile', {}),
            'socials': data.get('socials', {})
        }

    # Initialize tables
    with app.app_context():
        init_db(app)

    @app.route('/')
    def index():
        data = load_portfolio_data()
        return render_template('index.html', **data)

    @app.route('/api/portfolio', methods=['GET'])
    def api_portfolio():
        data = load_portfolio_data()
        return jsonify(data)

    @app.route('/api/contact', methods=['POST'])
    def api_contact():
        # Handle both JSON and traditional Form submissions
        if request.is_json:
            payload = request.get_json() or {}
        else:
            payload = request.form.to_dict()

        name = (payload.get('name') or '').strip()
        email = (payload.get('email') or '').strip()
        brief = (payload.get('brief') or '').strip()
        budget = (payload.get('budget') or '').strip()

        # Handle services (could be array or comma-separated string)
        services_raw = payload.get('services', [])
        if isinstance(services_raw, list):
            services = ', '.join(services_raw)
        else:
            services = str(services_raw).strip()

        # Validation
        if not name or not email or not brief:
            return jsonify({
                'status': 'error',
                'message': 'Name, email, and project brief are required.'
            }), 400

        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, email):
            return jsonify({
                'status': 'error',
                'message': 'Please provide a valid email address.'
            }), 400

        # Persist to database
        db = get_db()
        cursor = db.cursor()
        now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(
            '''
            INSERT INTO messages (name, email, services, budget, brief, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ''',
            (name, email, services, budget, brief, now_str)
        )
        db.commit()

        return jsonify({
            'status': 'success',
            'message': f"Thank you, {name}! Your message has been received. Bam will be in touch shortly."
        }), 200

    @app.route('/api/github-contributions', methods=['GET'])
    def api_github_contributions():
        username = request.args.get('username') or 'bam841'
        force_refresh = request.args.get('refresh', '').lower() in ('true', '1')
        data = get_cached_github_contributions(username=username, force_refresh=force_refresh)
        return jsonify(data)

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(host='0.0.0.0', port=5000, debug=True)
