import { useEffect, useState } from "react";
import axios from "axios";
import { FaRocket, FaSearch, FaExpand } from "react-icons/fa";

export default function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNASA = async (selectedDate = '') => {
  try {
    setLoading(true)
    setError('')

    const apiKey = import.meta.env.VITE_NASA_API_KEY

    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

    if (selectedDate) {
      url += `&date=${selectedDate}`
    }

    const response = await axios.get(url, {
      timeout: 15000,
    })

    setData(response.data)
  } catch (err) {
    console.log(err)

    if (err.code === 'ECONNABORTED') {
      setError('Connection timeout. NASA API terlalu lama merespon.')
    } else {
      setError('NASA API gagal dimuat.')
    }
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchNASA();
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <FaRocket />
          Orbit Explorer
        </div>

        <div className="search-box">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={() => fetchNASA(date)}>
            <FaSearch />
            Search
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>NASA Astronomy Explorer</h1>
        <p>
          Cari gambar astronomi NASA berdasarkan tanggal asli dari NASA API.
        </p>
      </section>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading NASA data...</p>
        </div>
      ) : error ? (
        <div className="error">
          <h2>{error}</h2>
        </div>
      ) : (
        data && (
          <main className="card">
            <div className="image-wrapper">
              {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} />
              ) : (
                <iframe
                  src={data.url}
                  title="space-video"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <div className="content">
              <div className="top">
                <h2>{data.title}</h2>

                <a
                  href={data.hdurl || data.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaExpand />
                </a>
              </div>

              <span className="date">{data.date}</span>

              <p>{data.explanation}</p>
            </div>
          </main>
        )
      )}
    </div>
  );
}
