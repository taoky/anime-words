import json

def difficulty(word):
    if 2 <= len(word) <= 5:
        return 0
    elif 6 <= len(word) <= 8:
        return 1
    return 2

def generate():
    with open("../words.txt") as f:
        results = [[word.strip(), difficulty(word.strip())] for word in f]
        return results

if __name__ == "__main__":
    with open("gartic.json", "w") as f:
        json.dump(generate(), f, ensure_ascii=False)
