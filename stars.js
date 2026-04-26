// Enkla parametrar att ändra
        let starSize = 2;          // Storlek på stjärnor
        let starSpeed = 5;        // Max hastighet (slumpmässig 1 till starSpeed)
        let endPointDistance = 10; // Avstånd från centrum där stjärnor dör
        let bg = '#0e0e0e'

        // Vector2-klass för enkel vektormatematik
        class Vector2 {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            add(v) {
                return new Vector2(this.x + v.x, this.y + v.y);
            }
            sub(v) {
                return new Vector2(this.x - v.x, this.y - v.y);
            }
            mul(s) {
                return new Vector2(this.x * s, this.y * s);
            }
            normalize() {
                let len = Math.sqrt(this.x * this.x + this.y * this.y);
                return new Vector2(this.x / len, this.y / len);
            }
        }

        // Stars-klass
        class Stars {
            constructor(speed, size) {
                let canvas = document.getElementById('canvas');
                let w = canvas.width, h = canvas.height;
                let center = new Vector2(w / 2, h / 2);
                
                // Spawn på slumpmässig kant
                let side = Math.floor(Math.random() * 4);
                if (side === 0) { // top
                    this.pos = new Vector2(Math.random() * w, 0);
                } else if (side === 1) { // right
                    this.pos = new Vector2(w, Math.random() * h);
                } else if (side === 2) { // bottom
                    this.pos = new Vector2(Math.random() * w, h);
                } else { // left
                    this.pos = new Vector2(0, Math.random() * h);
                }
                
                // Riktning mot centrum
                this.direction = center.sub(this.pos).normalize();
                
                // Slumpmässig hastighet
                this.absVel = Math.floor(Math.random() * starSpeed) + 1;
                this.size = starSize;
                this.dead = false;
            }
            
            distance_from_center() {
                let canvas = document.getElementById('canvas');
                let w = canvas.width / 2, h = canvas.height / 2;
                let dx = this.pos.x - w;
                let dy = this.pos.y - h;
                return Math.sqrt(dx * dx + dy * dy);
            }
            
            move() {
                this.pos = this.pos.add(this.direction.mul(this.absVel));
            }
            
            draw(ctx) {
                let distance = this.distance_from_center();
                let fade_factor = Math.min(1, distance / 100);
                let tail_length = this.absVel * 3 * fade_factor;
                let tail_end = this.pos.sub(this.direction.mul(tail_length));
                let width = Math.max(1, Math.floor(2 * fade_factor));
                
                ctx.strokeStyle = 'white';
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(tail_end.x, tail_end.y);
                ctx.stroke();
            }
            
            update(ctx) {
                this.draw(ctx);
                this.move();
                this.deadcheck();
            }
            
            deadcheck() {
                if (this.distance_from_center() < endPointDistance) {
                    this.dead = true;
                }
            }
        }

        // Huvudkod
        let stars = [];
        let running = true;
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        // Gör canvas responsiv
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];  // Töm stjärnor vid resize för att anpassa till ny storlek
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();  // Initial setup

        function gameLoop() {
            if (!running) return;
            
            // Fyll skärmen
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Ta bort döda stjärnor
            stars = stars.filter(star => !star.dead);
            
            // Lägg till en ny stjärna
            stars.push(new Stars(10, 2));
            
            // Uppdatera alla stjärnor
            stars.forEach(star => star.update(ctx));
            
            requestAnimationFrame(gameLoop);
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                running = false;
            }
        });

        // Starta loopen
        gameLoop();