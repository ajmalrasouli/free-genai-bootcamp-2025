# Farsi Writing Practice App

An interactive application using Gradio to help users practice writing in Farsi (Persian). The app provides English sentences, uses Tesseract OCR to read handwritten Farsi images, and provides translation and grading feedback using the Google Gemini API.

## Features

- Random English sentences generated for translation practice.
- Upload handwritten Farsi text images.
- OCR processing using Tesseract with Persian language support.
- Literal translation of transcribed text via Google Gemini API.
- Graded feedback (S/A/B/C) on accuracy, grammar, and style via Google Gemini API.
- Proper RTL (Right-to-Left) text display for Farsi in a Textbox.

## Running the Application (via Docker Compose)

This service is designed to be run as part of the main multi-project setup using Docker Compose from the `Launcher` directory.

1.  **Ensure Prerequisites:** Make sure you have Docker and Docker Compose installed.
2.  **Configure API Key:** Set your `GOOGLE_API_KEY` in the `.env` file within the `Launcher` directory.
3.  **Start Services:** Navigate to the `Launcher` directory in your terminal and run:
    ```bash
    docker-compose up -d
    ```
4.  **Access:** Open your web browser and go to `http://localhost:8008`.

## Configuration

-   **`GOOGLE_API_KEY`:** The application requires a Google API Key with access to the Gemini API (e.g., `gemini-1.5-flash`). This key must be provided as an environment variable, typically set via the `.env` file in the `Launcher` directory.
-   **`prompts.yaml`:** Contains the prompts used to interact with the Google Gemini API for translation and grading. Located in the `writing-practice` directory.
-   **Tesseract:** Requires Tesseract OCR installed *inside the Docker container* along with the Farsi language pack (`tesseract-ocr-fas`). This is handled by the `writing-practice/Dockerfile`.

## Dependencies (Installed via Dockerfile)

-   `gradio`
-   `google-generativeai`
-   `pytesseract`
-   `Pillow`
-   `arabic-reshaper`
-   `python-bidi`
-   `PyYAML`
-   `python-dotenv`

## Troubleshooting

-   **OCR Issues:** Ensure Tesseract is correctly installed in the Docker image and that the writing is clear in the uploaded image.
-   **API Errors:** Check that the `GOOGLE_API_KEY` is correctly set in the `Launcher/.env` file and that the key is valid and has quota for the Gemini API.
-   **RTL Display:** Farsi text is displayed using a Gradio Textbox component. Ensure required libraries (`arabic-reshaper`, `python-bidi`) are installed.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
