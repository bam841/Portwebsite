#!/usr/bin/env python3
"""
Entry point for running the Bam Zapico Portfolio application locally.
"""
from app import create_app

app = create_app()

if __name__ == '__main__':
    print("==================================================")
    print("🚀 Bam Zapico — Creative Web Portfolio Server")
    print("📍 Local URL: http://127.0.0.1:5000")
    print("==================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
