document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const input = document.getElementById('image-input');
    const resultContainer = document.getElementById('result-container');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const file = input.files[0];
      if (!file) {
        alert('Please select an image file.');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', file);
  
      fetch('/run-script', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          resultContainer.innerHTML = `<pre>${data}</pre>`;
        })
        .catch((error) => {
          console.error(error);
          resultContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
        });
    });
  });

  
  