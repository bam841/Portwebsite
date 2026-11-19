import json
import os
import tempfile
import unittest
from app import create_app, init_db


class PortfolioAppTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        self.app = create_app({
            'TESTING': True,
            'DATABASE': self.db_path,
        })
        self.client = self.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        if os.path.exists(self.db_path):
            os.unlink(self.db_path)

    def test_index_page_renders(self):
        """Test that the homepage renders successfully with personalized user content."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.data.decode('utf-8')
        self.assertIn("John Abrahm Zapico", html)
        self.assertIn("Bam", html)
        self.assertIn("Portwebsite", html)
        self.assertIn("Interactive 3D Workstation Experience", html)

    def test_api_portfolio_endpoint(self):
        """Test that the portfolio JSON API returns full structured data."""
        response = self.client.get('/api/portfolio')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('profile', data)
        self.assertEqual(data['profile']['name'], 'John Abrahm Zapico')
        self.assertIn('projects', data)
        self.assertIn('skills', data)

    def test_contact_submission_success(self):
        """Test valid contact form submission via JSON API."""
        payload = {
            'name': 'Sarah Connor',
            'email': 'sarah@example.com',
            'services': ['Full-Stack Web', 'UI/UX Motion'],
            'budget': 'Freelance Web Project',
            'brief': 'Need a modern SaaS landing page built.'
        }
        response = self.client.post(
            '/api/contact',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result['status'], 'success')
        self.assertIn('Sarah Connor', result['message'])

    def test_contact_submission_validation_error(self):
        """Test contact form validation for missing fields and bad email."""
        # Missing brief
        payload = {
            'name': 'Tester',
            'email': 'test@example.com'
        }
        response = self.client.post(
            '/api/contact',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

        # Invalid email format
        bad_email_payload = {
            'name': 'Tester',
            'email': 'invalid-email',
            'brief': 'Hello world'
        }
        response = self.client.post(
            '/api/contact',
            data=json.dumps(bad_email_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_404_handler(self):
        """Test that unknown routes return 404 with custom template."""
        response = self.client.get('/nonexistent-page-route')
        self.assertEqual(response.status_code, 404)
        self.assertIn("Page Not Found", response.data.decode('utf-8'))

    def test_github_contributions_endpoint(self):
        """Test that the live GitHub contributions API returns contribution statistics."""
        response = self.client.get('/api/github-contributions')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('total', data)
        self.assertIn('contributions', data)
        self.assertGreater(len(data['contributions']), 0)
        self.assertIn('2026', data['total'])
        self.assertIsInstance(data['total']['2026'], int)
        self.assertGreaterEqual(data['total']['2026'], 300)

    def test_index_contains_github_heatmap(self):
        """Test that the landing page includes the GitHub contribution heatmap structure."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.data.decode('utf-8')
        self.assertIn('gh-heatmap-matrix', html)
        self.assertIn('Live GitHub Feed', html)
        self.assertIn('331 contributions in the last year', html)
        self.assertIn('hero-portrait-center', html)

    def test_viewport_scroll_domino_animation_system(self):
        """Test that viewport scroll trigger animations and classes are integrated."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.data.decode('utf-8')
        self.assertIn('domino-item', html)
        self.assertIn('picture-pop-in', html)
        self.assertIn('domino-active', html)

        # Check CSS contains dynamic active trigger rules
        with open('static/css/style.css', 'r', encoding='utf-8') as f:
            css = f.read()
        self.assertIn('.domino-item.domino-active', css)
        self.assertIn('.picture-pop-in.domino-active', css)
        self.assertIn('picturePop', css)

        # Check JS contains intersection observer engine
        with open('static/js/main.js', 'r', encoding='utf-8') as f:
            js = f.read()
        self.assertIn('initScrollDominoObserver', js)
        self.assertIn('activateDomino', js)
        self.assertIn('deactivateDomino', js)


if __name__ == '__main__':
    unittest.main()
