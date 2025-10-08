# Stream Resource Files

This directory hosts static assets that are exposed under the /resources path by the Express server.

- Upload the Capgemini pseudo coding questions PDF as capgemini-pseudo.pdf.
- The file will be available at http://YOUR_BACKEND_HOST/resources/capgemini-pseudo.pdf.
- Update the stream configuration if the filename changes so the resourceUrl continues to match.

These files are not committed by default; add a .gitignore rule if you plan to keep large binaries out of version control.
