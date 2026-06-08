from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import app
print('Listing all registered routes (path, methods):')
for r in app.routes:
	methods = getattr(r, 'methods', None)
	print(repr(r.path), methods)
