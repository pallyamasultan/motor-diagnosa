async function test() {
  const query = 'harga Sensor TPS Honda CBR150R';
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.error('No API key');
    return;
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      max_results: 5,
    }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
