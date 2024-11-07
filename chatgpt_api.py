import openai
import sys

# Masukkan API Key dari OpenAI
openai.api_key = 'YOUR_OPENAI_API_KEY'

def chatbot(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    reply = response.choices[0].message.content
    return reply

if __name__ == "__main__":
    question = sys.argv[1]
    answer = chatbot(question)
    print(answer)
