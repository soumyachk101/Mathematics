import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Fix HTML tag
    content = content.replace('<html data-theme="dark" lang="en">', '<html lang="en">')
    content = content.replace('<html lang="en" data-theme="dark">', '<html lang="en">')

    # Remove nav-actions
    # The block looks like:
    # <div class="nav-actions">
    # <button aria-label="Toggle Theme" class="theme-toggle-btn" id="theme-toggle"></button>
    # </div>
    # Or variations with spaces.
    content = re.sub(r'<div class="nav-actions">\s*<button[^>]*id="theme-toggle"[^>]*>.*?</button>\s*</div>', '', content, flags=re.DOTALL)

    with open(file, 'w') as f:
        f.write(content)
    print(f"Cleaned up {file}")
