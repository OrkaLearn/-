const invbut = document.getElementById('invbut');
const bubbles = document.getElementById('bubbles');

invbut.addEventListener('click', function() {
    // 1. Create a new element (e.g., a <p> tag)
    const newPic = document.createElement('img');
    const newBubble = document.createElement('p');

    // 2. Set the content for the new element
    newPic.src = 'imgs/propicph.png';
    newBubble.textContent = '一二三同学：';
    
    // Optional: Add a class for styling
    newPic.classList.add('propic');
    newBubble.classList.add('bubble');

    // 3. Append the new element to the container
    bubbles.appendChild(newPic);
    bubbles.appendChild(newBubble);
});