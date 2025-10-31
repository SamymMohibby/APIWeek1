const dogs = ["affenpinscher", "beagle", "chow", "doberman", "borzoi"];

// 1) Build the DOM once and keep references
const container = document.createElement("div");
container.className = "container";

const nodes = []; // [{ h1, p, img }, ...]

for (let i = 0; i < dogs.length; i++) {
  const wrapper = document.createElement("div");
  wrapper.className = "wiki-item";
  wrapper.dataset.breed = dogs[i]; // optional, handy for debugging

  const h1 = document.createElement("h1");
  h1.className = "wiki-header";
  h1.textContent = dogs[i]; // placeholder until Wikipedia loads
  wrapper.appendChild(h1);

  const content = document.createElement("div");
  content.className = "wiki-content";
  wrapper.appendChild(content);

  const p = document.createElement("p");
  p.className = "wiki-text";
  p.textContent = "Loading summary…";
  content.appendChild(p);

  const imageContainer = document.createElement("div");
  imageContainer.className = "img-container";
  content.appendChild(imageContainer);

  const img = document.createElement("img");
  img.className = "wiki-img"
  img.alt = dogs[i];
  imageContainer.appendChild(img);

  container.appendChild(wrapper);

  nodes.push({ h1, p, img });
}

document.body.appendChild(container);

// 2) Fill images
const getDogImage = async () => {
  await Promise.all(
    dogs.map(async (dog, i) => {
      try {
        const res = await fetch(`https://dog.ceo/api/breed/${dog}/images/random`);
        const data = await res.json();
        nodes[i].img.src = data.message;
      } catch (e) {
        nodes[i].img.alt = `${dog} (image failed)`;
      }
    })
  );
};

// 3) Fill Wikipedia summaries
const fetchWikipedia = async () => {
  await Promise.all(
    dogs.map(async (dog, i) => {
      try {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(dog)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await res.json();

        // Use API-provided title if present
        nodes[i].h1.textContent = data.title || dog;
        nodes[i].p.textContent = data.extract || "No summary available.";
      } catch (e) {
        nodes[i].p.textContent = "Failed to load summary.";
      }
    })
  );
};

const main = async () => {
  await getDogImage();
  await fetchWikipedia();
};

main();
