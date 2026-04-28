import os
import json
import re
from dotenv import load_dotenv
from openai import AzureOpenAI

from app.dimensions import DIMENSIONS
SYSTEM_PROMPT = """
You are a senior AI maturity assessment consultant designing a professional benchmarking survey for Global Capability Centers (GCCs), similar to the EY GARIX framework.

You will generate ONE question per sub-dimension.

Requirements:
- Consulting-grade language (C-suite level)
- Specific to persona and role
- Directly tied to the given sub-dimension
- Focus on measurable maturity (not opinions)
- Clear, single question (no multi-part questions)
- Do NOT generalize or combine multiple sub-dimensions

Each question MUST include exactly 5 options:
- Each option has:
  - "label": short (2-4 words), specific (NO generic words like Initial, Developing)
  - "description": 1 sentence explaining maturity level

Options must progress from LOW → HIGH maturity.

Return ONLY valid JSON.
"""


load_dotenv()


# ---------- Azure OpenAI Client ----------
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-12-01-preview"
)

deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")


# ---------- Utility ----------
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s]+", "-", text)
    return text.strip("-")


# ---------- AI GENERATION ----------
def generate_questions(persona: str, role: str):
    all_questions = []

    for dim in DIMENSIONS:
        for sub in dim["sub_dimensions"]:

            user_prompt = f"""
Persona: {persona}
Role: {role}

Dimension: {dim['name']}
Sub-dimension: {sub}

Generate ONE benchmarking question strictly for this sub-dimension.

Return JSON:
{{
  "dimension_id": {dim['id']},
  "dimension_name": "{dim['name']}",
  "question": "...",
  "options": [
    {{"label": "...", "description": "..."}},
    {{"label": "...", "description": "..."}},
    {{"label": "...", "description": "..."}},
    {{"label": "...", "description": "..."}},
    {{"label": "...", "description": "..."}}
  ]
}}
"""

            response = client.chat.completions.create(
                model=deployment,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )

            content = response.choices[0].message.content.strip()

            # ✅ CLEAN markdown
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content[:-3]

            # ✅ PARSE JSON
# ✅ PARSE JSON
            question = json.loads(content)

            # ✅ ADD KEYS
            keys = ["A", "B", "C", "D", "E"]
            for i, opt in enumerate(question["options"]):
                opt["key"] = keys[i]

            # ✅ ADD ID
            question["id"] = len(all_questions) + 1

            # ✅ ADD TO LIST
            all_questions.append(question)

    return all_questions
def main():
    persona = "GCC Leadership"
    role = "GCC Head"

    print(f"Generating questions for {persona} / {role}...")

    questions = generate_questions(persona, role)

    data = {
        "persona": persona,
        "role": role,
        "questions": questions
    }

    with open("questions.json", "w") as f:
        json.dump(data, f, indent=2)

    print("✅ 27 Questions generated and saved locally!")