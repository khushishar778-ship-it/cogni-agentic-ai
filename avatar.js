(() => {
  class CogniAvatar {
    constructor(canvasId, statusId) {
      this.canvas = document.getElementById(canvasId);
      this.statusEl = document.getElementById(statusId);
      this.state = 'idle';
      this.phase = 0;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.core = this.createCore();
      this.network = this.createNetwork();
      this.glow = this.createGlow();
      this.scene.add(this.core, this.network, this.glow);

      const ambient = new THREE.AmbientLight(0x87b7ff, 0.7);
      const point = new THREE.PointLight(0x7ff0ff, 1.2, 20);
      point.position.set(3, 3, 3);
      this.scene.add(ambient, point);

      this.onResize();
      window.addEventListener('resize', () => this.onResize());
      this.animate();
    }

    createCore() {
      const geom = new THREE.IcosahedronGeometry(1.1, 2);
      const mat = new THREE.MeshPhongMaterial({
        color: 0x57ccff,
        emissive: 0x2f4cff,
        shininess: 90,
        transparent: true,
        opacity: 0.88,
        wireframe: true
      });
      return new THREE.Mesh(geom, mat);
    }

    createNetwork() {
      const group = new THREE.Group();
      const points = [];
      for (let i = 0; i < 34; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(1.8 + Math.random() * 0.4);
        points.push(v);
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0xb0ecff }));
        p.position.copy(v);
        group.add(p);
      }
      for (let i = 0; i < points.length; i += 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[(i + 7) % points.length]]);
        const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x6a80ff, transparent: true, opacity: 0.4 }));
        group.add(line);
      }
      return group;
    }

    createGlow() {
      const geom = new THREE.SphereGeometry(1.8, 32, 32);
      const mat = new THREE.MeshBasicMaterial({ color: 0x53b6ff, transparent: true, opacity: 0.13 });
      return new THREE.Mesh(geom, mat);
    }

    setState(next) {
      this.state = next;
      const labelMap = { idle: 'Idle Awareness', listening: 'Listening...', responding: 'Generating Reflection...', speaking: 'Voice Resonance', typing: 'Sensing Input...' };
      this.statusEl.textContent = labelMap[next] || labelMap.idle;
    }

    onResize() {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      this.phase += 0.02;
      this.core.rotation.x += 0.003;
      this.core.rotation.y += 0.005;
      this.network.rotation.y -= 0.002;
      this.network.position.y = Math.sin(this.phase) * 0.08;

      let scale = 1 + Math.sin(this.phase * 1.5) * 0.02;
      let glow = 0.12;
      if (this.state === 'listening') { scale += 0.06; glow = 0.2 + Math.abs(Math.sin(this.phase * 4)) * 0.12; }
      if (this.state === 'responding') { scale += 0.12; glow = 0.3; }
      if (this.state === 'speaking') { scale += Math.abs(Math.sin(this.phase * 5)) * 0.12; glow = 0.25; }
      if (this.state === 'typing') { scale += 0.04; glow = 0.18; }

      this.core.scale.setScalar(scale);
      this.glow.material.opacity += (glow - this.glow.material.opacity) * 0.08;
      this.glow.scale.setScalar(1 + scale * 0.08);
      this.renderer.render(this.scene, this.camera);
    }
  }

  window.CogniAvatar = CogniAvatar;
})();
