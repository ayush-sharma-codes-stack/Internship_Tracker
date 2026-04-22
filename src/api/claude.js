
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Remotive se live jobs fetch karta hai (FREE, no key needed)
const fetchRemotiveJobs = async (query) => {
  const response = await fetch(
    `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=20`
  );
  const data = await response.json();
  
  return data.jobs.map((job, idx) => ({
    id: `remotive-${job.id || idx}`,
    company: job.company_name || 'Unknown',
    role: job.title || 'Internship',
    location: job.candidate_required_location || 'Remote',
    stipend: job.salary || 'Not disclosed',
    duration: '3-6 Months',
    applyLink: job.url || '#',
    source: 'Remotive',
    postedDate: job.publication_date?.split('T')[0] || 'Recent',
    skills: job.tags || []
  }));
};

// Groq se AI filtering (FREE)
const filterWithGroq = async (jobs, query) => {
  if (!GROQ_API_KEY) return jobs; // key nahi hai toh raw results return karo

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are a job filter. Given a list of jobs and a search query, return ONLY the most relevant jobs as a valid JSON array. No markdown, no explanation. Keep all original fields.`
        },
        {
          role: 'user',
          content: `Query: "${query}"\n\nJobs: ${JSON.stringify(jobs.slice(0, 10))}\n\nReturn top 8 most relevant as JSON array.`
        }
      ]
    })
  });

  const data = await response.json();
  try {
    let text = data.choices[0].message.content.trim();
    if (text.startsWith('```json')) text = text.substring(7);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    return JSON.parse(text.trim());
  } catch {
    return jobs; // parse fail toh original return karo
  }
};

export const fetchInternships = async (searchQuery) => {
  const query = searchQuery || 'software developer internship';
  
  try {
    // Step 1: Remotive se live data lo
    const jobs = await fetchRemotiveJobs(query);
    
    if (jobs.length === 0) {
      throw new Error('No internships found. Try a different search!');
    }

    // Step 2: Groq se filter karo (optional)
    if (GROQ_API_KEY) {
      return await filterWithGroq(jobs, query);
    }

    return jobs;

  } catch (err) {
    throw new Error(err.message || 'Failed to fetch internships');
  }
};