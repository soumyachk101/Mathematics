// Dijkstra's Shortest Path Algorithm Visualizer for 2024 Question 11(a)

class DijkstraVisualizer {
  constructor() {
    this.nodes = {
      'A': { x: 50, y: 150, dist: 0, pred: null, visited: false },
      'B': { x: 170, y: 70, dist: Infinity, pred: null, visited: false },
      'C': { x: 170, y: 230, dist: Infinity, pred: null, visited: false },
      'D': { x: 290, y: 70, dist: Infinity, pred: null, visited: false },
      'E': { x: 290, y: 230, dist: Infinity, pred: null, visited: false }
    };
    
    this.edges = [
      { u: 'A', v: 'B', w: 5 },
      { u: 'A', v: 'C', w: 3 },
      { u: 'B', v: 'C', w: 2 },
      { u: 'B', v: 'D', w: 6 },
      { u: 'C', v: 'D', w: 7 },
      { u: 'C', v: 'E', w: 4 },
      { u: 'D', v: 'E', w: 5 }
    ];

    this.steps = [];
    this.currentStepIndex = -1;
    this.generateSteps();
    this.initDOM();
  }

  generateSteps() {
    // Generate the step-by-step state sequence
    let currentNodes = JSON.parse(JSON.stringify(this.nodes));
    let unvisited = ['A', 'B', 'C', 'D', 'E'];
    
    // Initial state
    this.steps.push({
      currentNode: null,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: "Initialize distances: d(A) = 0, others = ∞. All nodes are unvisited.",
      highlightEdges: [],
      activeVertex: null
    });

    while (unvisited.length > 0) {
      // Find node with minimum distance
      let minNode = null;
      let minDist = Infinity;
      for (let n of unvisited) {
        if (currentNodes[n].dist < minDist) {
          minDist = currentNodes[n].dist;
          minNode = n;
        }
      }

      if (minNode === null) break;

      // Highlight select node
      this.steps.push({
        currentNode: minNode,
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        description: `Select node <strong>${minNode}</strong> with the smallest tentative distance (${minDist === Infinity ? '∞' : minDist}).`,
        highlightEdges: [],
        activeVertex: minNode
      });

      // Relax neighbors
      let neighbors = this.edges.filter(e => (e.u === minNode && unvisited.includes(e.v)) || (e.v === minNode && unvisited.includes(e.u)));
      let highlightEdges = [];
      
      neighbors.forEach(edge => {
        let neighbor = edge.u === minNode ? edge.v : edge.u;
        let newDist = currentNodes[minNode].dist + edge.w;
        let updated = false;

        highlightEdges.push({ u: edge.u, v: edge.v, status: 'checking' });

        if (newDist < currentNodes[neighbor].dist) {
          currentNodes[neighbor].dist = newDist;
          currentNodes[neighbor].pred = minNode;
          updated = true;
        }
        
        this.steps.push({
          currentNode: minNode,
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          description: `Relax edge ${minNode}-${neighbor} (weight ${edge.w}). ${updated ? `Updated d(${neighbor}) to ${newDist} via ${minNode}.` : `No update for d(${neighbor}) since ${newDist} &ge; current distance ${currentNodes[neighbor].dist === Infinity ? '∞' : currentNodes[neighbor].dist}.`}`,
          highlightEdges: [{ u: edge.u, v: edge.v, status: updated ? 'updated' : 'checking' }],
          activeVertex: minNode
        });
      });

      // Mark visited
      currentNodes[minNode].visited = true;
      unvisited = unvisited.filter(n => n !== minNode);
      
      this.steps.push({
        currentNode: minNode,
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        description: `Mark node <strong>${minNode}</strong> as visited. Its shortest distance from A is finalized as ${currentNodes[minNode].dist}.`,
        highlightEdges: [],
        activeVertex: minNode
      });
    }

    // Final Shortest Path Tree highlighting
    this.steps.push({
      currentNode: null,
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: "Algorithm completed! Bold blue lines indicate the final Shortest Path Tree from root A.",
      highlightEdges: [],
      activeVertex: null,
      isFinal: true
    });
  }

  initDOM() {
    const nextBtn = document.getElementById("dijkstra-next");
    const prevBtn = document.getElementById("dijkstra-prev");
    const resetBtn = document.getElementById("dijkstra-reset");
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextStep());
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.prevStep());
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.reset());
    }

    this.renderStep(0);
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderStep(this.currentStepIndex);
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderStep(this.currentStepIndex);
    }
  }

  reset() {
    this.currentStepIndex = 0;
    this.renderStep(0);
  }

  renderStep(index) {
    this.currentStepIndex = index;
    const step = this.steps[index];
    
    // Update buttons
    const nextBtn = document.getElementById("dijkstra-next");
    const prevBtn = document.getElementById("dijkstra-prev");
    if (nextBtn) nextBtn.disabled = index === this.steps.length - 1;
    if (prevBtn) prevBtn.disabled = index === 0;

    // Update explanation
    const desc = document.getElementById("dijkstra-desc");
    if (desc) desc.innerHTML = step.description;

    // Render Table
    this.renderTable(step.nodes, step.activeVertex);

    // Render SVG
    this.renderSVG(step);
  }

  renderTable(stepNodes, activeVertex) {
    const tbody = document.getElementById("dijkstra-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    Object.keys(stepNodes).forEach(key => {
      const node = stepNodes[key];
      const tr = document.createElement("tr");
      
      if (key === activeVertex) {
        tr.className = "active-row";
      } else if (node.visited) {
        tr.className = "visited-row";
      }

      const distText = node.dist === Infinity ? "∞" : node.dist;
      const predText = node.pred ? node.pred : "-";
      const statusText = node.visited ? "Finalized" : "Unvisited";

      tr.innerHTML = `
        <td><strong>${key}</strong></td>
        <td>${distText}</td>
        <td>${predText}</td>
        <td>${statusText}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderSVG(step) {
    const svg = document.querySelector("#dijkstra-svg");
    if (!svg) return;

    // Clear previous contents
    svg.innerHTML = `
      <!-- Define marker arrow -->
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
        <marker id="arrow-shortest" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
      </defs>
    `;

    // Render Edges
    this.edges.forEach(edge => {
      const uNode = this.nodes[edge.u];
      const vNode = this.nodes[edge.v];
      
      // Determine line color and weight
      let strokeColor = "var(--card-border)";
      let strokeWidth = "2";
      
      // Check if this edge is active/checking in current step
      const highlight = step.highlightEdges.find(h => (h.u === edge.u && h.v === edge.v) || (h.u === edge.v && h.v === edge.u));
      if (highlight) {
        if (highlight.status === 'updated') {
          strokeColor = "var(--success-color)";
          strokeWidth = "4";
        } else {
          strokeColor = "var(--accent-color)";
          strokeWidth = "3";
        }
      } else if (step.isFinal || step.nodes[edge.v].visited || step.nodes[edge.u].visited) {
        // If final or predecessor relationship is established, paint green/blue
        // A predecessor link: if v's predecessor is u, or u's predecessor is v
        const isPredecessorLink = (step.nodes[edge.v].pred === edge.u && step.nodes[edge.v].visited) || 
                                  (step.nodes[edge.u].pred === edge.v && step.nodes[edge.u].visited);
        if (isPredecessorLink) {
          strokeColor = "var(--accent-color)";
          strokeWidth = "4";
        } else {
          strokeColor = "rgba(100, 116, 139, 0.2)";
          strokeWidth = "1.5";
        }
      }

      // Draw path line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", uNode.x);
      line.setAttribute("y1", uNode.y);
      line.setAttribute("x2", vNode.x);
      line.setAttribute("y2", vNode.y);
      line.setAttribute("stroke", strokeColor);
      line.setAttribute("stroke-width", strokeWidth);
      svg.appendChild(line);

      // Draw weight label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const midX = (uNode.x + vNode.x) / 2;
      const midY = (uNode.y + vNode.y) / 2 - 8;
      text.setAttribute("x", midX);
      text.setAttribute("y", midY);
      text.setAttribute("fill", "var(--text-secondary)");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "600");
      text.setAttribute("text-anchor", "middle");
      text.textContent = edge.w;
      svg.appendChild(text);
    });

    // Render Nodes
    Object.keys(this.nodes).forEach(key => {
      const node = this.nodes[key];
      const stepNode = step.nodes[key];
      
      // Determine colors
      let circleFill = "var(--bg-secondary)";
      let strokeColor = "var(--card-border)";
      let strokeWidth = "2";
      let shadowGlow = "";

      if (key === step.activeVertex) {
        circleFill = "var(--accent-color)";
        strokeColor = "var(--text-primary)";
        strokeWidth = "3";
      } else if (stepNode.visited) {
        circleFill = "var(--bg-tertiary)";
        strokeColor = "var(--success-color)";
        strokeWidth = "3";
      }

      // Group
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", node.x);
      circle.setAttribute("cy", node.y);
      circle.setAttribute("r", "18");
      circle.setAttribute("fill", circleFill);
      circle.setAttribute("stroke", strokeColor);
      circle.setAttribute("stroke-width", strokeWidth);
      g.appendChild(circle);

      // Label Text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", node.x);
      text.setAttribute("y", node.y + 5);
      text.setAttribute("fill", key === step.activeVertex ? "#ffffff" : "var(--text-primary)");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("text-anchor", "middle");
      text.textContent = key;
      g.appendChild(text);

      // Distance Subscript Text
      const distSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
      distSub.setAttribute("x", node.x);
      distSub.setAttribute("y", node.y + 32);
      distSub.setAttribute("fill", stepNode.visited ? "var(--success-color)" : "var(--text-secondary)");
      distSub.setAttribute("font-size", "11");
      distSub.setAttribute("font-weight", "600");
      distSub.setAttribute("text-anchor", "middle");
      const dVal = stepNode.dist === Infinity ? "∞" : stepNode.dist;
      distSub.textContent = `d=${dVal}`;
      g.appendChild(distSub);

      svg.appendChild(g);
    });
  }
}

// Instantiate visualizer when page loads
window.addEventListener("load", () => {
  if (document.getElementById("dijkstra-svg")) {
    window.dijkstra = new DijkstraVisualizer();
  }
});
