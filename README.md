# Ард-Жамп Game

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation & Running

#### Windows:
1. Open Command Prompt or PowerShell
2. Navigate to the game folder:
   ```bash
   cd game
   ```
3. Run the startup script:
   ```bash
   start_server.bat
   ```

#### Linux/Mac:
1. Open Terminal
2. Navigate to the game folder:
   ```bash
   cd game
   ```
3. Make the script executable:
   ```bash
   chmod +x start_server.sh
   ```
4. Run the startup script:
   ```bash
   ./start_server.sh
   ```

#### Manual Setup:
1. Navigate to the game folder:
   ```bash
   cd game
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Accessing the Game

Once the server is running:
- **Standalone game**: Open http://localhost:8000 in your browser
- **Full website with modal**: Open `index.html` in your browser and click "Тоглоом эхлэх"

### Project Structure

```
EXE/
├── game/                 # Game application
│   ├── main.py          # FastAPI server
│   ├── index.html       # Game HTML
│   ├── requirements.txt # Python dependencies
│   ├── static/          # CSS, JS, images
│   ├── start_server.bat # Windows startup script
│   └── start_server.sh  # Linux/Mac startup script
├── images/              # Website images
├── index.html           # Main landing page
└── README.md            # This file
```

### Troubleshooting

**Port already in use:**
If port 8000 is already in use, you can change it in the startup scripts or run:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```
Then update the iframe source in `index.html` to `http://localhost:8080`

**Dependencies not installing:**
Make sure you have Python and pip installed:
```bash
python --version
pip --version
```
