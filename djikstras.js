document.addEventListener('DOMContentLoaded', () => {
    createGraph();
  });
  
  // Create the graphical representation of the graph
  function createGraph() {
    const graphContainer = document.getElementById('graph-container');
    const graph = {
      A: { B: 1, C: 4, E: 2 },
      B: { A: 1, C: 2, D: 5 },
      C: { A: 4, B: 2, D: 1, E: 3 },
      D: { B: 5, C: 1, F: 2 },
      E: { A: 2, C: 3, F: 4 },
      F: { D: 2, E: 4 }
    };
  
    const positions = {
      A: { top: 100, left: 100 },
      B: { top: 100, left: 300 },
      C: { top: 300, left: 100 },
      D: { top: 300, left: 300 },
      E: { top: 200, left: 50 },
      F: { top: 400, left: 200 }
    };
  
    // Create nodes
    for (const node in graph) {
      const div = document.createElement('div');
      div.classList.add('node');
      div.id = node;
      div.innerText = node;
      div.style.position = 'absolute';
      div.style.top = `${positions[node].top}px`;
      div.style.left = `${positions[node].left}px`;
      graphContainer.appendChild(div);
    }
  
    // Create edges with weights
    for (const node in graph) {
      for (const neighbor in graph[node]) {
        const startDiv = document.getElementById(node);
        const endDiv = document.getElementById(neighbor);
  
        if (startDiv && endDiv) {
          const edge = document.createElement('div');
          edge.classList.add('edge');
  
          const dx = positions[neighbor].left - positions[node].left;
          const dy = positions[neighbor].top - positions[node].top;
          const length = Math.sqrt(dx * dx + dy * dy);
  
          edge.style.width = `${length}px`;
          edge.style.height = '1px';
          edge.style.backgroundColor = '#000';
          edge.style.position = 'absolute';
          edge.style.top = '50%';
          edge.style.left = '50%';
          edge.style.transformOrigin = '0 0';
          edge.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
          
          const weightLabel = document.createElement('span');
          weightLabel.innerText = graph[node][neighbor];
          weightLabel.style.position = 'absolute';
          weightLabel.style.top = '-10px';
          weightLabel.style.left = `${length / 2}px`;
          weightLabel.style.transform = 'translateX(-50%)';
  
          edge.appendChild(weightLabel);
          startDiv.appendChild(edge);
        }
      }
    }
  }
  
  // Visualize Dijkstra's algorithm step by step
  function visualizeDijkstra() {
    const graph = {
      A: { B: 1, C: 4, E: 2 },
      B: { A: 1, C: 2, D: 5 },
      C: { A: 4, B: 2, D: 1, E: 3 },
      D: { B: 5, C: 1, F: 2 },
      E: { A: 2, C: 3, F: 4 },
      F: { D: 2, E: 4 }
    };
  
    const start = 'A';
    const result = dijkstra(graph, start);
  
    // Highlight nodes in the order of the shortest path calculation
    for (const node in result.distances) {
      setTimeout(() => {
        document.getElementById(node).classList.add('active');
      }, result.distances[node] * 1000);
    }
  }
  
  // Priority Queue class for managing the nodes to visit
  class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    // Add a new element to the queue
    enqueue(element, priority) {
      const queueElement = { element, priority };
      let added = false;
  
      // Insert the element in the correct position based on priority
      for (let i = 0; i < this.queue.length; i++) {
        if (queueElement.priority < this.queue[i].priority) {
          this.queue.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
  
      // If the element has the highest priority, add it to the end
      if (!added) {
        this.queue.push(queueElement);
      }
    }
  
    // Remove and return the element with the highest priority (lowest value)
    dequeue() {
      return this.queue.shift().element;
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  // Dijkstra's algorithm implementation
  function dijkstra(graph, start) {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueue();
  
    // Initialize distances and priority queue
    for (const vertex in graph) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      prev[vertex] = null;
    }
  
    // Process the priority queue
    while (!pq.isEmpty()) {
      const currentVertex = pq.dequeue();
  
      // Update distances for each neighbor of the current vertex
      for (const neighbor in graph[currentVertex]) {
        const alt = distances[currentVertex] + graph[currentVertex][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = currentVertex;
          pq.enqueue(neighbor, alt);
        }
      }
    }
  
    return { distances, prev };
  }
  
  