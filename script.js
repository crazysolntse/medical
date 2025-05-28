async function askAI() {
  const input = document.getElementById('questionInput');
  const responseDiv = document.getElementById('response');
  const question = input.value.trim();

  if (!question) {
    alert("Пожалуйста, введите вопрос.");
    return;
  }

  responseDiv.textContent = "Обработка...";
  input.disabled = true;

  const apiKey = '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'; // Замени на свой ключ

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions ", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen-max", // можно заменить на deepseek/deepseek-chat или др.
        messages: [
          {
            role: "system",
            content: "Вы - медицинский консультант. Давайте рекомендации по здоровью, не ставьте диагноз, а советуйте обращаться к врачу при необходимости."
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || "Ошибка от сервера");
    }

    const answer = data.choices[0]?.message?.content || "Не удалось получить ответ.";
    responseDiv.textContent = "🧠 Ответ: " + answer;
  } catch (err) {
    console.error(err);
    responseDiv.textContent = "Ошибка: Не удалось получить ответ от AI.";
  } finally {
    input.disabled = false;
  }
}
