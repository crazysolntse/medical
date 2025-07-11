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
        model: "qwen/qwen-max", // можно заменить на deepseek/deepseek-chat или др. qwen/qwen-max
        messages: [
          {
            role: "system",
            content: "Ты знаток ресторанов в Москве. Посоветуй 3 топовых места по запросу. Учти все нюансы запроса, включая местоположение, не выдумывай места, покажи реальные. Сначала покажи название, в одной фразе опиши особенности места. Далее ценовая категория (₽,₽₽,₽₽₽) и Номер телефона. Далее гео (метро и название улицы). Проверь название улицы в яндекс картах и укажи его. Раздели все пункты жирной точкой и \n  "
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || "Ошибка от сервера");
    }

    const answer = data.choices[0]?.message?.content || "Не удалось получить ответ.";
    const htmlAnswer = marked.parse(answer);
    
    responseDiv.innerHTML = htmlAnswer;
  } catch (err) {
    console.error(err);
    responseDiv.textContent = "Ошибка: Не удалось получить ответ от AI.";
  } finally {
    input.disabled = false;
  }
}
