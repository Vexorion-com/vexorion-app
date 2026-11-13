"""Local, dependency-free Vexorion preview server."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description="Run the local Vexorion frontend.")
parser.add_argument("--port", type=int, default=4173)
args = parser.parse_args()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).resolve().parent), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
print(f"Vexorion is running at http://localhost:{args.port}", flush=True)
server.serve_forever()
