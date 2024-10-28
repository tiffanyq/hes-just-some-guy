const FRAME_RATE = 18;
const PIXEL_SIZE = 16;
const NOISE_REDUCTION_FACTOR = 190;
const OPACITY = 255;
const EMOJIS_TO_REMOVE_PER_FRAME = 1;
const PIXEL_FRAME_RATE_MODIFIER = 3;
const MIN_EMOJI_SIZE = 18;
const EMOJI_MULTIPLIER = 36;
const EMOJIS = ["😃", "🙂", "😌","😗", "💖"];
let c;
let emojiArray = [];
let currNumEmojisGenerated = 0;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  describe('Grey pixel static beneath a large emoji that alternates between smiling and smiling with a tear.');
  cnv.style('display', 'block');
  frameRate(FRAME_RATE);

  // default white background
  c = color(255,255,255);
}

function draw() {
  if (frameCount % PIXEL_FRAME_RATE_MODIFIER === 0) { // let emojis fade faster than the pixel frame rate
    for (let i = 0; i < windowHeight; i++) {
      const inter = map(i, 0, window.innerHeight, 0, 1);
      stroke(c);
      line(0, i, window.innerWidth, i);
    }
    noStroke(); // turn off stroke for the pixels
    for (let i = 0; i < windowWidth; i+=PIXEL_SIZE) {
      for (let j = 0; j < windowHeight; j+=PIXEL_SIZE) {
        currFactor = random(0,1);
        const currShade = 255 * noise(currFactor*i, currFactor*j) + NOISE_REDUCTION_FACTOR;
        if (currShade <= 255) {
          const fillColor = color(currShade,currShade,currShade);
          fillColor.setAlpha(OPACITY);
          fill(fillColor);
          rect(i,j,PIXEL_SIZE,PIXEL_SIZE);
        }
      }
    }
  }
  for (let i = 0; i < EMOJIS_TO_REMOVE_PER_FRAME; i++) {
    // gradually remove emojis
    if (emojiArray.length > 0) {
      const currEmoji = emojiArray.shift(); 
      currEmojiElement = document.getElementById(currEmoji.id);
      currEmojiElement.remove();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// stamping emojis
class Emoji {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.size = MIN_EMOJI_SIZE + Math.floor(Math.random() * EMOJI_MULTIPLIER);
    this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    currNumEmojisGenerated++;
    this.id = currNumEmojisGenerated;
  }

  render() {
    const b = document.getElementById("body-container");
    const emojiElement = document.createElement("div");
    emojiElement.innerText = this.emoji;
    emojiElement.style.position = "fixed";
    emojiElement.style.fontSize = this.size + "px";
    emojiElement.style.color = "#ffffff";
    emojiElement.style.userSelect = "none";
    emojiElement.style.left = this.x.toString() + "px";
    emojiElement.style.top = this.y.toString() + "px";
    emojiElement.id = this.id;
    b.appendChild(emojiElement);
  }
}

function createEmoji(e) {
  let h;
  if (!e.clientX) {
    h = new Emoji(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  } else {
    h = new Emoji(e.clientX, e.clientY);
  }
  h.render();
  imFine(); // also switch the face
  emojiArray.push(h); // add to emoji array for removal over time
}
