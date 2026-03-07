# Instructions

### Install

1. Create new environment

```
python3.11 -m venv venv
```

2. Activate

```
source venv/bin/activate
source venv/bin/activate && pip install ipykernel
```

3. Upgrade pip
```
pip install --upgrade pip
```

4. Install

```
pip install -r ./requirements.txt
```

### Ollama

1. Install ollama
2. Install model: `ollama 3.2` (will work)
3. Install `ollama pull mxbai-embed-large`


### Notes:
how to check what version of package exist
```
pip index versions sentence-transformers 2>/dev/null | head -20
```