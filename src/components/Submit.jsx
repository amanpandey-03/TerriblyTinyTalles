import React, { useState } from 'react';

const WordFrequencyComponent = () => {
  const [histogramData, setHistogramData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const words = text.toLowerCase().match(/\w+/g); // Split text into words

      const frequencyMap = {};
      words.forEach((word) => {
        frequencyMap[word] = frequencyMap[word] ? frequencyMap[word] + 1 : 1;
      });

      const sortedWords = Object.keys(frequencyMap).sort((a, b) => {
        return frequencyMap[b] - frequencyMap[a];
      });

      const top20Words = sortedWords.slice(0, 20).map((word) => ({
        word,
        frequency: frequencyMap[word],
      }));

      setHistogramData(top20Words);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportHistogramData = () => {
    const csvContent = 'data:text/csv;charset=utf-8,';
    const header = ['Word', 'Frequency'].join(',');
    const rows = histogramData.map(({ word, frequency }) => `${word},${frequency}`);
    const csv = [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent + csv);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'histogram.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {histogramData.length > 0 && (
        <div>
          <h2>Word Frequency Histogram</h2>
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {histogramData.map(({ word, frequency }) => (
                <tr key={word}>
                  <td>{word}</td>
                  <td>{frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportHistogramData}>Export</button>
        </div>
      )}
    </div>
  );
};

export default WordFrequencyComponent;
