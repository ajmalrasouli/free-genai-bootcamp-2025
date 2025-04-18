import os
import base64
from pathlib import Path

# Dictionary containing base64 encoded reference images for ASL letters
ASL_IMAGES = {
    'A': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9Ijg2cHgiIGhlaWdodD0iMTE0cHgiIHN0eWxlPSJzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyB0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IGltYWdlLXJlbmRlcmluZzpvcHRpbWl6ZVF1YWxpdHk7IGZpbGwtcnVsZTpldmVub2RkOyBjbGlwLXJ1bGU6ZXZlbm9kZCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmVmZWZlIiBkPSJNIC0wLjUsLTAuNSBDIDI4LjE2NjcsLTAuNSA1Ni44MzMzLC0wLjUgODUuNSwtMC41QyA4NS41LDM3LjUgODUuNSw3NS41IDg1LjUsMTEzLjVDIDU2LjgzMzMsMTEzLjUgMjguMTY2NywxMTMuNSAtMC41LDExMy41QyAtMC41LDc1LjUgLTAuNSwzNy41IC0wLjUsLTAuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjMDYwNjA2IiBkPSJNIDM3LjUsMjEuNSBDIDQwLjc3NjYsMjEuMjE2MSA0My45NDMzLDIxLjU0OTUgNDcsMjIuNUMgNTQuODY3LDQyLjI2OTEgNjIuMDMzNyw2Mi4yNjkxIDY4LjUsODIuNUMgNjUuNTUyNSw4Mi43NzcxIDYyLjcxOTEsODIuNDQzOCA2MCw4MS41QyA1OC41NTQ2LDc2LjQ5NDEgNTYuNzIxMyw3MS42NjA3IDU0LjUsNjdDIDQ1LjgzOTcsNjYuNTAwMiAzNy4xNzMxLDY2LjMzMzYgMjguNSw2Ni41QyAyNy4zMTAyLDcxLjU3MTMgMjUuODEwMiw3Ni41NzEzIDI0LDgxLjVDIDIxLjYxOTQsODIuNDM1IDE5LjExOTQsODIuNzY4MyAxNi41LDgyLjVDIDIyLjg5ODYsNjEuOTcxMyAyOS44OTg2LDQxLjYzNzkgMzcuNSwyMS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMGYwZjAiIGQ9Ik0gNDEuNSwyOS41IEMgNDUuNTMwNiwzOS4yNDc5IDQ5LjE5NzIsNDkuMjQ3OSA1Mi41LDU5LjVDIDQ1LjUzMTYsNjAuNDk3IDM4LjUzMTYsNjAuODMwMyAzMS41LDYwLjVDIDM0LjQzMzYsNTAuMDMyNyAzNy43NjY5LDM5LjY5OTQgNDEuNSwyOS41IFoiLz48L2c+Cjwvc3ZnPg==',
    'B': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDgwIDUwIEMgODAgNTAgODAgMTUwIDgwIDE1MCBNIDgwIDEwMCBDIDgwIDEwMCAxMjAgMTAwIDEyMCAxMDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    'C': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    # Placeholders for D-Z using 'C' image data
    'D': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'E': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'F': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'G': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'H': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'I': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'J': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'K': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'L': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'M': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'N': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'O': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'P': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'Q': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'R': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'S': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'T': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'U': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'V': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'W': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'X': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'Y': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9Ijg2cHgiIGhlaWdodD0iMTE0cHgiIHN0eWxlPSJzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyB0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IGltYWdlLXJlbmRlcmluZzpvcHRpbWl6ZVF1YWxpdHk7IGZpbGwtcnVsZTpldmVub2RkOyBjbGlwLXJ1bGU6ZXZlbm9kZCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmVmZWZlIiBkPSJNIC0wLjUsLTAuNSBDIDI4LjE2NjcsLTAuNSA1Ni44MzMzLC0wLjUgODUuNSwtMC41QyA4NS41LDM3LjUgODUuNSw3NS41IDg1LjUsMTEzLjVDIDU2LjgzMzMsMTEzLjUgMjguMTY2NywxMTMuNSAtMC41LDExMy41QyAtMC41LDc1LjUgLTAuNSwzNy41IC0wLjUsLTAuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjMGIwYjBiIiBkPSJNIDIyLjUsMjguNSBDIDI1LjI0NjksMjguMTg2NiAyNy45MTM1LDI4LjUyIDMwLjUsMjkuNUMgMzUuMjcyNSwzOC43MTEzIDM5Ljc3MjUsNDguMDQ0NyA0NCw1Ny41QyA0OC4yMTE1LDQ4LjA3NTYgNTIuNzExNSwzOC43NDIyIDU3LjUsMjkuNUMgNjAuMDg2NSwyOC41MiA2Mi43NTMxLDI4LjE4NjYgNjUuNSwyOC41QyA2MC40ODQ0LDQwLjg2NTMgNTQuNjUxLDUyLjg2NTMgNDgsNjQuNUMgNDcuNTAwMyw3Mi44MjY3IDQ3LjMzMzYsODEuMTYgNDcuNSw4OS41QyA0NC44ODA2LDg5Ljc2ODMgNDIuMzgwNiw4OS40MzUgNDAsODguNUMgMzkuNjY2Nyw4MC4xNjY3IDM5LjMzMzMsNzEuODMzMyAzOSw2My41QyAzMi40MDY2LDUyLjMxNDggMjYuOTA2Niw0MC42NDgxIDIyLjUsMjguNSBaIi8+PC9nPgo8L3N2Zz4=',
    'Z': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4='
}

def get_reference_image_html(letter):
    """Get HTML for displaying reference image of an ASL letter."""
    if letter in ASL_IMAGES:
        return f"""
        <div style="text-align: center; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Reference: Letter {letter}</h3>
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="{ASL_IMAGES[letter]}" 
                     alt="ASL Letter {letter}" 
                     style="max-width: 200px; border: 2px solid #3498db; border-radius: 5px; background-color: white;">
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #7f8c8d;">
                Practice this hand shape
            </div>
        </div>
        """
    return ""

def get_all_reference_images_html():
    """Get HTML for displaying all ASL reference images."""
    html = """
    <div style="padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">ASL Alphabet Reference Guide</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
    """
    
    for letter in sorted(ASL_IMAGES.keys()):
        html += f"""
        <div style="text-align: center; border: 1px solid #e0e0e0; padding: 15px; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Letter {letter}</h3>
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="{ASL_IMAGES[letter]}" 
                     alt="ASL Letter {letter}" 
                     style="width: 100%; max-width: 180px; border: 2px solid #3498db; border-radius: 5px; background-color: white;">
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #7f8c8d;">
                Practice this hand shape
            </div>
        </div>
        """
    
    html += """
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 10px;">
            <h3 style="color: #2c3e50;">How to Use</h3>
            <ol style="text-align: left; max-width: 600px; margin: 0 auto; color: #34495e;">
                <li>Study each letter's hand shape carefully</li>
                <li>Practice making the shape with your dominant hand</li>
                <li>Use the Practice Mode to check your gestures</li>
                <li>Try the Test Mode to test your knowledge</li>
            </ol>
        </div>
    </div>
    """
    return html

def get_letter_description(letter):
    """Get text description of how to form each letter."""
    descriptions = {
        'A': "Make a fist with your thumb resting against the side of your hand.",
        'B': "Hold your hand up with all fingers straight and together, thumb tucked.",
        'C': "Curve your fingers and thumb to form a 'C' shape."
    }
    return descriptions.get(letter, "")
