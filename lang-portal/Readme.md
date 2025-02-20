## Install

```sh
pip install -r requirements.txt
```

## Setup DB

```
invoke init-db
```

## Run

```sh
python app.py
```

# Here are reliable ways to verify your virtual environment activation:

# 1. Check your Python interpreter path
import sys
print(sys.executable)
# If it shows path containing 'venv', you're in the virtual environment
# Example: /path/to/project/venv/bin/python

# 2. Check installed packages location
import site
print(site.getsitepackages())
# Should point to your venv directory
# Example: ['/path/to/project/venv/lib/python3.x/site-packages']

# 3. From terminal, check pip location
# $ which pip  # Unix/Linux
# $ where pip  # Windows
# Should point to venv/bin/pip or venv/Scripts/pip
