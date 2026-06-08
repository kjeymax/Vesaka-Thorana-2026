/**
 * Interactive Digital Thorana Canvas Engine - 10 Panel Edition
 * Features: True LED glow rendering, Sri Lankan Buddhist flag colors, 
 * 10 Jathaka story panels wrapped in Lotus petals, and Liyawela motifs.
 */

export function createThoranaEngine(canvas, onPanelClick) {

    const ctx = canvas.getContext('2d', { alpha: false });

    let width, height, centerX, centerY, scale;
    let bulbs = [];
    let storyPanels = [];
    let stars = [];
    let lanterns = [];
    let fireworks = [];
    let loadedImages = [];

    // Lotus pond interactivity
    let koiFishes = [];
    let waterRipples = [];
    let offeredLamps = [];
    let offeredLotuses = [];
    let floatingSkyLanterns = [];
    let ambientParticles = [];

    // Day/Night Sync
    let isDayTime = false;
    let birds = [];
    let fireflies = [];
    let isLightsOn = true;

    let animationFrameId;
    let time = 0;
    let currentPattern = 'sequential';
    let currentSpeed = 1.0;
    let currentAudioEnergy = 0;
    let performanceMode = false;

    // Buddhist Flag Colors (Neela, Peetha, Lohitha, Odata, Manjestha/Prabashwara)
    const COLORS = {
        blue: { on: '#005CE6', glow: '#0088ff', off: '#001133' }, // Neela
        yellow: { on: '#FFD700', glow: '#ffaa00', off: '#332200' }, // Peetha
        red: { on: '#EB1C24', glow: '#ff3333', off: '#330000' },  // Lohitha
        white: { on: '#FFFFFF', glow: '#cccccc', off: '#333333' }, // Odata
        orange: { on: '#F58220', glow: '#ff6600', off: '#331100' }, // Manjestha
        prabashwara: { on: '#FF00FF', glow: '#ff66ff', off: '#330033' } // Mixed representation
    };

    let activeColorSequence = ['blue', 'yellow', 'red', 'white', 'orange'];

    let isMobile = false;
    let bulbSpacing = 16;
    let treeCacheCanvas = null;
    let lotusCacheCanvas = null;
    let sparkCacheCanvas = null;
    let fireflyCacheCanvas = null;
    let branchTips = [];
    let lastBellStrikeTime = 0;
    let bellSwingAngle = 0;
    let bellSwingVelocity = 0;
    let bellRippleActive = false;
    let bellRippleProgress = 0;
    let bellRippleIntensity = 0;

    let lanternCache = null;
    let lanternCacheOffset = 0;
    let bgCache = null;
    let buddhaCanvasCache = null;
    let bulbCaches = {};
    let textBulbCaches = {};
    let bulbCacheOffset = 0;

    // Initialize & Resize
    function init() {
        let hour = new Date().getHours();
        isDayTime = (hour >= 6 && hour < 18); // 6 AM to 5:59 PM is Day

        loadImages();
        resize();
        window.addEventListener('resize', resize);

        setupInteraction();

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        loop();
    }

    function resize() {
        let resMultiplier = performanceMode ? 0.6 : 1.0;
        width = window.innerWidth * resMultiplier;
        height = window.innerHeight * resMultiplier;
        canvas.width = width;
        canvas.height = height;
        centerX = width / 2;

        isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.innerWidth < 768);
        bulbSpacing = isMobile ? 26 : 18;

        // Ensure there is always enough space for both the top of the Pandal and the Lotus Pond at the bottom.
        // We increase the virtual height divisor (1300) and slightly decrease the multiplier (0.9) to make it fit perfectly.
        // Guarantee scale is a safe positive number to prevent division/step infinite loops
        scale = Math.max(0.05, Math.min(width / 1200, height / 1300) * 0.9);

        // On landscape (desktop), keep it closer to the center but slightly up to show the lake well
        if (width > height) {
            centerY = height * 0.48;
        } else {
            // On portrait (mobile), the scale is restricted by width, so height naturally has plenty of room
            centerY = height / 2 + (height * 0.05);
        }

        buddhaCanvasCache = null; // Clear cache on resize

        setupBackground();
        setupGeometry();

        // Pre-render static/heavy elements after scale calculation
        preRenderBackground();
        preRenderLantern();
        preRenderBulbs();
        preRenderTree();
        preRenderLotus();
        preRenderSpark();
        preRenderFirefly();
    }

    let buddhaImg = new Image();
    let mahaImg = new Image();

    function loadImages() {
        loadedImages = [];
        // Load images from 1 to 10. Assuming they are in 'images' folder
        for (let i = 1; i <= 10; i++) {
            let img = new Image();
            img.src = `/Images/${i}.webp`;
            loadedImages.push(img);
        }
        buddhaImg.src = '/Images/buddha main.webp';
        mahaImg.src = '/Images/MAHA.webp';
    }

    function setupBackground() {
        stars = [];
        if (!isDayTime) {
            let numStars = performanceMode ? 60 : 200;
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * (height * 0.8), // mostly in sky
                    size: Math.random() * 1.5,
                    twinkleSpeed: 0.02 + Math.random() * 0.05,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        birds = [];
        if (isDayTime) {
            let numBirds = performanceMode ? 6 : 15;
            for (let i = 0; i < numBirds; i++) {
                birds.push({
                    x: Math.random() * width,
                    y: height * 0.05 + Math.random() * height * 0.3,
                    speed: (1 + Math.random() * 2) * scale,
                    wingSpeed: 0.1 + Math.random() * 0.1,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        fireflies = [];
        if (!isDayTime) {
            let numFireflies = performanceMode ? 15 : 40;
            for (let i = 0; i < numFireflies; i++) {
                fireflies.push({
                    x: Math.random() * width,
                    y: height * 0.4 + Math.random() * height * 0.6,
                    speedX: (Math.random() - 0.5) * 1.5,
                    speedY: (Math.random() - 0.5) * 1.5,
                    phase: Math.random() * Math.PI * 2,
                    blinkSpeed: 0.02 + Math.random() * 0.05
                });
            }
        }

        lanterns = [];
        // Place lanterns to hang realistically around the top branches of the Bo tree
        let numLanterns = performanceMode ? 3 : 8;
        for (let i = 0; i < numLanterns; i++) {
            lanterns.push({
                x: width * 0.1 + (Math.random() * width * 0.8), // spread across screen
                y: -20 + Math.random() * 80, // Pivot point near the top
                stringLength: 100 + Math.random() * 250, // Length of the string hanging down
                wobbleSpeed: 0.005 + Math.random() * 0.015, // Slow wind sway
                wobblePhase: Math.random() * Math.PI * 2,
                scale: 0.4 + Math.random() * 0.4 // Varying sizes
            });
        }

        // Initialize Koi Fishes
        koiFishes = [];
        let numKoi = performanceMode ? 3 : 8;
        for (let i = 0; i < numKoi; i++) {
            koiFishes.push({
                x: width * 0.1 + Math.random() * width * 0.8,
                y: (height * 0.8) + Math.random() * (height * 0.2), // initial rough Y
                angle: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5,
                targetX: null,
                targetY: null,
                color: ['#ff4500', '#ffa500', '#ff8c00', '#eee'][Math.floor(Math.random() * 4)],
                wobbleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function preRenderBackground() {
        bgCache = document.createElement('canvas');
        bgCache.width = width;
        bgCache.height = height;
        let bCtx = bgCache.getContext('2d');

        if (isDayTime) {
            // Day sky gradient
            let gradient = bCtx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#5A9BD5'); // Bright blue sky
            gradient.addColorStop(1, '#87CEEB'); // Light blue horizon
            bCtx.fillStyle = gradient;
            bCtx.fillRect(0, 0, width, height);

            // Draw Sun
            let sunX = width * 0.15;
            let sunY = height * 0.2;

            let sunGlow = bCtx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 200 * scale);
            sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
            sunGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.3)');
            sunGlow.addColorStop(1, 'rgba(255, 200, 50, 0)');
            bCtx.fillStyle = sunGlow;
            bCtx.beginPath();
            bCtx.arc(sunX, sunY, 200 * scale, 0, Math.PI * 2);
            bCtx.fill();

            bCtx.fillStyle = '#FFFBCC';
            bCtx.beginPath();
            bCtx.arc(sunX, sunY, 40 * scale, 0, Math.PI * 2);
            bCtx.shadowBlur = 40;
            bCtx.shadowColor = '#FFD700';
            bCtx.fill();
            bCtx.shadowBlur = 0; // reset

            // Draw static clouds in background cache
            bCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const drawCloud = (cx, cy, s) => {
                bCtx.beginPath();
                bCtx.arc(cx, cy, 30 * s, 0, Math.PI * 2);
                bCtx.arc(cx + 25 * s, cy - 15 * s, 35 * s, 0, Math.PI * 2);
                bCtx.arc(cx + 50 * s, cy, 25 * s, 0, Math.PI * 2);
                bCtx.arc(cx + 25 * s, cy + 10 * s, 30 * s, 0, Math.PI * 2);
                bCtx.fill();
            };
            drawCloud(width * 0.3, height * 0.15, scale * 1.2);
            drawCloud(width * 0.7, height * 0.1, scale * 1.5);
            drawCloud(width * 0.85, height * 0.25, scale * 0.8);
            drawCloud(width * 0.1, height * 0.3, scale * 1.0);
        } else {
            // Night sky gradient
            let gradient = bCtx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#020b1a');
            gradient.addColorStop(1, '#0a1930');
            bCtx.fillStyle = gradient;
            bCtx.fillRect(0, 0, width, height);

            // Draw Moon
            let moonX = width * 0.15;
            let moonY = height * 0.2;

            let moonGlow = bCtx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 150 * scale);
            moonGlow.addColorStop(0, 'rgba(255, 255, 220, 0.4)');
            moonGlow.addColorStop(1, 'rgba(255, 255, 220, 0)');
            bCtx.fillStyle = moonGlow;
            bCtx.beginPath();
            bCtx.arc(moonX, moonY, 150 * scale, 0, Math.PI * 2);
            bCtx.fill();

            bCtx.fillStyle = '#ffffe6';
            bCtx.beginPath();
            bCtx.arc(moonX, moonY, 30 * scale, 0, Math.PI * 2);
            bCtx.shadowBlur = 20;
            bCtx.shadowColor = '#ffffff';
            bCtx.fill();
            bCtx.shadowBlur = 0;
        }

        // Draw distant village/temple landscape at the horizon
        let horizonY = centerY + 410 * scale;

        // Distant Mountains
        bCtx.fillStyle = isDayTime ? '#4a6042' : '#030a14'; // Brownish-green day, very dark night
        bCtx.beginPath();
        bCtx.moveTo(0, horizonY);
        let mSpacing = Math.max(10, 40 * scale);
        for (let lx = 0; lx <= width; lx += mSpacing) {
            let ly = horizonY - 40 * scale - Math.random() * 60 * scale;
            ly -= Math.sin(lx * 0.002) * 50 * scale;
            bCtx.lineTo(lx, ly);
        }
        bCtx.lineTo(width, horizonY);
        bCtx.fill();

        // Draw a waterfall on one of the mountains (left side)
        let waterfallX = width * 0.25;
        let waterfallTopY = horizonY - 90 * scale;
        bCtx.fillStyle = isDayTime ? 'rgba(230, 240, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';
        bCtx.beginPath();
        bCtx.moveTo(waterfallX, waterfallTopY);
        bCtx.lineTo(waterfallX + 15 * scale, waterfallTopY);
        bCtx.lineTo(waterfallX + 25 * scale, horizonY);
        bCtx.lineTo(waterfallX - 5 * scale, horizonY);
        bCtx.fill();

        if (isDayTime) {
            bCtx.strokeStyle = 'rgba(255,255,255,0.5)';
            bCtx.lineWidth = 2 * scale;
            bCtx.beginPath();
            bCtx.moveTo(waterfallX + 5 * scale, waterfallTopY);
            bCtx.lineTo(waterfallX + 10 * scale, horizonY);
            bCtx.moveTo(waterfallX + 10 * scale, waterfallTopY);
            bCtx.lineTo(waterfallX + 18 * scale, horizonY);
            bCtx.stroke();
        }

        // Distant forest/trees (in front of mountains)
        bCtx.fillStyle = isDayTime ? '#143820' : '#01050a'; // Dark green day, very dark night
        bCtx.beginPath();
        bCtx.moveTo(0, horizonY);
        let fSpacing = Math.max(5, 20 * scale);
        for (let lx = 0; lx <= width; lx += fSpacing) {
            let ly = horizonY - 15 * scale - Math.random() * 25 * scale;
            ly -= Math.sin(lx * 0.003) * 30 * scale; // Rolling hills
            bCtx.lineTo(lx, ly);
        }
        bCtx.lineTo(width, horizonY);
        bCtx.fill();

        // Draw Stupa (Dagaba) on the right side
        let stupaX = width * 0.85;
        let stupaBaseY = horizonY - Math.sin(stupaX * 0.003) * 30 * scale - 5 * scale;

        bCtx.fillStyle = isDayTime ? '#f0f4f1' : '#0a1018'; // Bright white day, dark blueish night
        if (isDayTime) {
            bCtx.shadowBlur = 15;
            bCtx.shadowColor = 'rgba(255,255,255,0.8)';
        }

        // Pesawalalu (Base rings)
        bCtx.fillRect(stupaX - 45 * scale, stupaBaseY - 8 * scale, 90 * scale, 8 * scale);
        bCtx.fillRect(stupaX - 40 * scale, stupaBaseY - 15 * scale, 80 * scale, 7 * scale);
        bCtx.fillRect(stupaX - 35 * scale, stupaBaseY - 22 * scale, 70 * scale, 7 * scale);

        // Garbhaya (Dome)
        bCtx.beginPath();
        bCtx.arc(stupaX, stupaBaseY - 22 * scale, 35 * scale, Math.PI, 0);
        bCtx.fill();

        // Hataras Kotuwa (Square chamber)
        bCtx.fillRect(stupaX - 10 * scale, stupaBaseY - 67 * scale, 20 * scale, 12 * scale);

        // Koth Kerella (Spire)
        bCtx.beginPath();
        bCtx.moveTo(stupaX - 7 * scale, stupaBaseY - 67 * scale);
        bCtx.lineTo(stupaX + 7 * scale, stupaBaseY - 67 * scale);
        bCtx.lineTo(stupaX, stupaBaseY - 105 * scale);
        bCtx.fill();

        // Chuda Manikya (Crystal)
        bCtx.fillStyle = '#FFD700';
        bCtx.beginPath();
        bCtx.arc(stupaX, stupaBaseY - 106 * scale, 2.5 * scale, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.shadowBlur = 0;

        // Draw Temple Roof (Buduge) near the Stupa
        let roofX = stupaX - 120 * scale;
        let roofY = horizonY - Math.sin(roofX * 0.003) * 30 * scale - 15 * scale;

        // Walls
        bCtx.fillStyle = isDayTime ? '#e6e3dc' : '#05080c';
        bCtx.fillRect(roofX - 25 * scale, roofY - 20 * scale, 50 * scale, 20 * scale);

        // Roof
        bCtx.fillStyle = isDayTime ? '#8a3c26' : '#030508'; // Reddish-brown tile roof day
        bCtx.beginPath();
        bCtx.moveTo(roofX - 35 * scale, roofY - 15 * scale);
        bCtx.quadraticCurveTo(roofX, roofY - 40 * scale, roofX + 35 * scale, roofY - 15 * scale);
        bCtx.lineTo(roofX + 30 * scale, roofY - 15 * scale);
        bCtx.quadraticCurveTo(roofX, roofY - 30 * scale, roofX - 30 * scale, roofY - 15 * scale);
        bCtx.fill();
    }

    function preRenderLantern() {
        lanternCache = document.createElement('canvas');
        let size = 160;
        lanternCache.width = size;
        lanternCache.height = size;
        let lCtx = lanternCache.getContext('2d');
        lanternCacheOffset = size / 2;

        lCtx.translate(lanternCacheOffset, lanternCacheOffset);

        // Ambient outer glow
        let glow = lCtx.createRadialGradient(0, 0, 0, 0, 0, 50);
        glow.addColorStop(0, 'rgba(255, 255, 200, 1)');
        glow.addColorStop(0.4, 'rgba(255, 150, 0, 0.6)');
        glow.addColorStop(1, 'rgba(255, 100, 0, 0)');

        lCtx.fillStyle = glow;
        lCtx.beginPath();
        lCtx.arc(0, 0, 70, 0, Math.PI * 2);
        lCtx.fill();

        // Realistic Atapattama (Vesak Lantern) Base Shape
        lCtx.fillStyle = 'rgba(255, 230, 140, 0.95)'; // Yellowish tissue paper
        lCtx.strokeStyle = '#5c2c16'; // Dark bamboo frame
        lCtx.lineWidth = 1.5;

        // Main hexagonal body
        lCtx.beginPath();
        lCtx.moveTo(-20, -30);
        lCtx.lineTo(20, -30);
        lCtx.lineTo(35, 0);
        lCtx.lineTo(20, 30);
        lCtx.lineTo(-20, 30);
        lCtx.lineTo(-35, 0);
        lCtx.closePath();
        lCtx.fill();
        lCtx.stroke();

        // Inner 3D Bamboo Frame Lines
        lCtx.beginPath();
        lCtx.moveTo(0, -30); lCtx.lineTo(0, 30); // Center vertical
        lCtx.moveTo(-35, 0); lCtx.lineTo(35, 0); // Center horizontal
        lCtx.moveTo(-20, -30); lCtx.lineTo(20, 30); // Diagonal 1
        lCtx.moveTo(20, -30); lCtx.lineTo(-20, 30); // Diagonal 2
        lCtx.stroke();

        // Top and Bottom Red Caps (Saucer shape of Atapattama)
        lCtx.fillStyle = 'rgba(235, 60, 40, 0.95)';

        // Top Cap
        lCtx.beginPath();
        lCtx.moveTo(-20, -30);
        lCtx.lineTo(20, -30);
        lCtx.lineTo(0, -45);
        lCtx.closePath();
        lCtx.fill();
        lCtx.stroke();

        // Bottom Cap
        lCtx.beginPath();
        lCtx.moveTo(-20, 30);
        lCtx.lineTo(20, 30);
        lCtx.lineTo(0, 45);
        lCtx.closePath();
        lCtx.fill();
        lCtx.stroke();

        // Bright internal candle flame
        lCtx.fillStyle = '#ffffff';
        lCtx.shadowBlur = 10;
        lCtx.shadowColor = '#ffffff';
        lCtx.beginPath();
        lCtx.arc(0, 5, 5, 0, Math.PI * 2);
        lCtx.fill();
    }

    function preRenderBulbs() {
        bulbCaches = {};
        textBulbCaches = {};
        let bulbRadius = Math.max(0.8, 2.5 * scale);
        let glowRadius = Math.max(4, 12 * scale);
        let offRadius = Math.max(0.4, 1.5 * scale);

        let canvasSize = Math.ceil(glowRadius * 2 + bulbRadius * 2) + 10;
        bulbCacheOffset = canvasSize / 2;

        for (let color in COLORS) {
            let colorDef = COLORS[color];

            // Render ON state
            let onCanvas = document.createElement('canvas');
            onCanvas.width = canvasSize;
            onCanvas.height = canvasSize;
            let onCtx = onCanvas.getContext('2d');

            onCtx.shadowBlur = glowRadius;
            onCtx.shadowColor = colorDef.glow;
            onCtx.beginPath();
            onCtx.arc(bulbCacheOffset, bulbCacheOffset, bulbRadius, 0, Math.PI * 2);
            onCtx.fillStyle = colorDef.on;
            onCtx.fill();

            // Render OFF state
            let offCanvas = document.createElement('canvas');
            offCanvas.width = canvasSize;
            offCanvas.height = canvasSize;
            let offCtx = offCanvas.getContext('2d');

            offCtx.beginPath();
            offCtx.arc(bulbCacheOffset, bulbCacheOffset, offRadius, 0, Math.PI * 2);

            if (isDayTime) {
                // Look like unlit colored plastic in day
                offCtx.fillStyle = colorDef.on;
                offCtx.fill();
                // Add slight plastic reflection
                offCtx.fillStyle = 'rgba(255,255,255,0.4)';
                offCtx.beginPath();
                offCtx.arc(bulbCacheOffset - 0.5 * scale, bulbCacheOffset - 0.5 * scale, offRadius * 0.4, 0, Math.PI * 2);
                offCtx.fill();
            } else {
                offCtx.fillStyle = colorDef.off;
                offCtx.fill();
            }

            bulbCaches[color] = { on: onCanvas, off: offCanvas };

            // --- Specialized Cache for Text Bulbs (Sharp & Low Bloom) ---
            let textGlowRadius = Math.max(2, 5 * scale);
            let textCanvasSize = Math.ceil(textGlowRadius * 2 + bulbRadius * 2) + 10;

            let tOnCanvas = document.createElement('canvas');
            tOnCanvas.width = textCanvasSize; tOnCanvas.height = textCanvasSize;
            let tOnCtx = tOnCanvas.getContext('2d');
            tOnCtx.shadowBlur = textGlowRadius;
            // As requested: "try giving black and see"
            // Use the original color for the core, and a black drop-shadow to separate it from the background!
            tOnCtx.shadowColor = '#000000';
            tOnCtx.beginPath();
            tOnCtx.arc(textCanvasSize / 2, textCanvasSize / 2, Math.max(0.8, 1.2 * scale), 0, Math.PI * 2);
            tOnCtx.fillStyle = colorDef.on;
            tOnCtx.fill();

            let tOffCanvas = document.createElement('canvas');
            tOffCanvas.width = textCanvasSize; tOffCanvas.height = textCanvasSize;
            let tOffCtx = tOffCanvas.getContext('2d');
            tOffCtx.beginPath();
            tOffCtx.arc(textCanvasSize / 2, textCanvasSize / 2, Math.max(0.4, 1.0 * scale), 0, Math.PI * 2);
            tOffCtx.fillStyle = colorDef.off;
            tOffCtx.fill();

            textBulbCaches[color] = { on: tOnCanvas, off: tOffCanvas, offset: textCanvasSize / 2 };
        }
    }

    function preRenderTree() {
        treeCacheCanvas = document.createElement('canvas');
        treeCacheCanvas.width = width;
        treeCacheCanvas.height = height;
        let tCtx = treeCacheCanvas.getContext('2d');

        tCtx.save();
        tCtx.fillStyle = '#010306';
        tCtx.strokeStyle = '#010306';
        tCtx.lineJoin = 'round';
        tCtx.lineCap = 'round';

        branchTips = [];
        let clusterId = 0;
        let branchCounter = 0;

        function drawBranch(startX, startY, length, angle, thickness, depth) {
            branchCounter++;
            let currentBranchId = branchCounter;

            tCtx.beginPath();
            tCtx.moveTo(startX, startY);

            let endX = startX + Math.cos(angle) * length;
            let endY = startY + Math.sin(angle) * length;

            let cpX = startX + Math.cos(angle) * length * 0.5;
            let cpY = startY + Math.sin(angle + 0.3) * length * 0.5;

            tCtx.quadraticCurveTo(cpX, cpY, endX, endY);
            tCtx.lineWidth = thickness * scale;
            tCtx.stroke();

            if (depth > 0) {
                drawBranch(endX, endY, length * 0.75, angle - 0.35, thickness * 0.65, depth - 1);
                drawBranch(endX, endY, length * 0.65, angle + 0.4, thickness * 0.6, depth - 1);

                if (depth <= 3) {
                    let rand = Math.sin(currentBranchId * 12.9898);
                    if (rand > 0.3) {
                        let midX = startX + (endX - startX) * 0.5;
                        let midY = startY + (endY - startY) * 0.5;
                        drawLeafCluster(midX, midY, angle, 4);
                    }
                }
            } else {
                drawLeafCluster(endX, endY, angle, isMobile ? 5 : 9);
                branchTips.push({ x: endX, y: endY });
            }
        }

        function drawBoLeaf(lx, ly, angle, size) {
            tCtx.save();
            tCtx.translate(lx, ly);
            tCtx.rotate(angle);
            tCtx.scale(size * scale, size * scale);

            tCtx.beginPath();
            tCtx.moveTo(0, 0);
            tCtx.bezierCurveTo(20, -20, 35, 15, 0, 45);
            tCtx.bezierCurveTo(-35, 15, -20, -20, 0, 0);
            tCtx.fill();

            tCtx.beginPath();
            tCtx.moveTo(0, 43);
            tCtx.quadraticCurveTo(5, 55, 0, 70);
            tCtx.lineWidth = 2;
            tCtx.stroke();

            tCtx.restore();
        }

        function drawLeafCluster(cx, cy, baseAngle, count) {
            clusterId++;
            for (let i = 0; i < count; i++) {
                let dropAngle = Math.PI / 2 + (i - count / 2) * 0.15;
                let radius = (i % 4) * 8 * scale;
                let scatterAngle = baseAngle + (i * Math.PI / 4);
                let ox = Math.cos(scatterAngle) * radius;
                let oy = Math.sin(scatterAngle) * radius;
                let leafSize = 0.15 + (i % 3) * 0.1;
                drawBoLeaf(cx + ox, cy + oy, dropAngle, leafSize);
            }
        }

        tCtx.beginPath();
        tCtx.moveTo(0, 0);
        tCtx.lineTo(width * 0.3, 0);
        tCtx.quadraticCurveTo(width * 0.2, height * 0.1, 0, height * 0.3);
        tCtx.fill();

        drawBranch(width * 0.05, height * 0.1, 180 * scale, Math.PI / 3, 22, 5);
        drawBranch(width * 0.15, height * 0.05, 250 * scale, Math.PI / 7, 25, 6);
        drawBranch(width * 0.25, -20 * scale, 280 * scale, Math.PI / 10, 20, 5);

        if (isDayTime) {
            tCtx.fillStyle = '#010306';

            let bx1 = width * 0.22; let by1 = height * 0.11;
            tCtx.beginPath();
            tCtx.ellipse(bx1, by1, 8 * scale, 6 * scale, 0, 0, Math.PI * 2);
            tCtx.arc(bx1 + 6 * scale, by1 - 5 * scale, 4 * scale, 0, Math.PI * 2);
            tCtx.moveTo(bx1 - 6 * scale, by1 + 2 * scale); tCtx.lineTo(bx1 - 15 * scale, by1 + 5 * scale); tCtx.lineTo(bx1 - 8 * scale, by1 + 6 * scale);
            tCtx.moveTo(bx1 + 10 * scale, by1 - 6 * scale); tCtx.lineTo(bx1 + 14 * scale, by1 - 4 * scale); tCtx.lineTo(bx1 + 9 * scale, by1 - 3 * scale);
            tCtx.fill();

            let bx2 = width * 0.08; let by2 = height * 0.19;
            tCtx.beginPath();
            tCtx.ellipse(bx2, by2, 7 * scale, 5 * scale, -0.2, 0, Math.PI * 2);
            tCtx.arc(bx2 + 5 * scale, by2 - 4 * scale, 3.5 * scale, 0, Math.PI * 2);
            tCtx.moveTo(bx2 - 5 * scale, by2 + 2 * scale); tCtx.lineTo(bx2 - 12 * scale, by2 + 7 * scale); tCtx.lineTo(bx2 - 7 * scale, by2 + 5 * scale);
            tCtx.moveTo(bx2 + 8 * scale, by2 - 5 * scale); tCtx.lineTo(bx2 + 12 * scale, by2 - 3 * scale); tCtx.lineTo(bx2 + 8 * scale, by2 - 2 * scale);
            tCtx.fill();

            let mx = width * 0.32; let my = height * 0.06;
            tCtx.strokeStyle = '#010306';
            tCtx.lineWidth = 2.5 * scale;
            tCtx.beginPath();
            tCtx.moveTo(mx, my);
            tCtx.quadraticCurveTo(mx - 10 * scale, my + 15 * scale, mx - 5 * scale, my + 30 * scale);
            tCtx.stroke();
            tCtx.beginPath();
            tCtx.ellipse(mx, my + 15 * scale, 5 * scale, 10 * scale, 0, 0, Math.PI * 2);
            tCtx.arc(mx, my + 25 * scale, 4 * scale, 0, Math.PI * 2);
            tCtx.fill();
            tCtx.beginPath();
            tCtx.moveTo(mx - 2 * scale, my + 10 * scale); tCtx.lineTo(mx - 10 * scale, my - 2 * scale);
            tCtx.moveTo(mx + 2 * scale, my + 10 * scale); tCtx.lineTo(mx - 5 * scale, my - 2 * scale);
            tCtx.stroke();
        }

        tCtx.restore();
    }

    function preRenderLotus() {
        lotusCacheCanvas = document.createElement('canvas');
        let size = 120;
        lotusCacheCanvas.width = size;
        lotusCacheCanvas.height = size;
        let lCtx = lotusCacheCanvas.getContext('2d');

        lCtx.save();
        lCtx.translate(size / 2, size / 2);

        lCtx.shadowBlur = 10;
        lCtx.shadowColor = '#ff69b4';
        lCtx.fillStyle = '#ffb6c1';

        const drawPetal = (angle) => {
            lCtx.save();
            lCtx.rotate(angle);
            lCtx.beginPath();
            lCtx.moveTo(0, 0);
            lCtx.bezierCurveTo(12, -8, 12, -24, 0, -32);
            lCtx.bezierCurveTo(-12, -24, -12, -8, 0, 0);
            lCtx.fill();
            lCtx.restore();
        };

        drawPetal(-0.8);
        drawPetal(0.8);
        drawPetal(-0.4);
        drawPetal(0.4);
        drawPetal(0);

        lCtx.shadowBlur = 0;
        lCtx.fillStyle = '#228b22';
        lCtx.beginPath();
        lCtx.ellipse(0, 3, 24, 6, 0, 0, Math.PI * 2);
        lCtx.fill();

        lCtx.restore();
    }

    function preRenderSpark() {
        sparkCacheCanvas = document.createElement('canvas');
        let size = 24;
        sparkCacheCanvas.width = size;
        sparkCacheCanvas.height = size;
        let sCtx = sparkCacheCanvas.getContext('2d');

        let grad = sCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(255, 230, 100, 1)');
        grad.addColorStop(0.4, 'rgba(255, 150, 0, 0.5)');
        grad.addColorStop(1, 'rgba(255, 100, 0, 0)');

        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        sCtx.fill();
    }

    function preRenderFirefly() {
        fireflyCacheCanvas = document.createElement('canvas');
        let size = 32;
        fireflyCacheCanvas.width = size;
        fireflyCacheCanvas.height = size;
        let fCtx = fireflyCacheCanvas.getContext('2d');

        let glow = fCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        glow.addColorStop(0, 'rgba(180, 255, 100, 1.0)');
        glow.addColorStop(0.35, 'rgba(100, 255, 50, 0.45)');
        glow.addColorStop(1, 'rgba(50, 150, 0, 0)');

        fCtx.fillStyle = glow;
        fCtx.beginPath();
        fCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        fCtx.fill();
    }

    // --- Geometry & Bulb Generation ---
    function setupGeometry() {
        bulbs = [];
        storyPanels = [];

        let colorIdx = 0;
        const nextColor = () => activeColorSequence[(colorIdx++) % activeColorSequence.length];

        // 1. Center Buddha Halo (Concentric circles using dynamic flag pattern)
        createCircleGroup(centerX, centerY - 120 * scale, 70 * scale, 10, nextColor(), 'halo-1');
        createCircleGroup(centerX, centerY - 120 * scale, 90 * scale, 10, nextColor(), 'halo-2');
        createCircleGroup(centerX, centerY - 120 * scale, 110 * scale, 10, nextColor(), 'halo-3');
        createCircleGroup(centerX, centerY - 120 * scale, 130 * scale, 10, nextColor(), 'halo-4');
        createCircleGroup(centerX, centerY - 120 * scale, 150 * scale, 10, nextColor(), 'halo-5');
        createCircleGroup(centerX, centerY - 120 * scale, 170 * scale, 10, nextColor(), 'halo-6');

        // Center Buddha Lotus Seat has been removed as the main PNG image includes its own beautifully detailed lotus seat.

        // 2. 10 Story Panels Configuration
        const panelRadius = 75 * scale;
        const panelPositions = [
            { id: 1, x: -450, y: 300, flag: 'blue' },
            { id: 2, x: -500, y: 70, flag: 'yellow' },
            { id: 3, x: -400, y: -130, flag: 'red' },
            { id: 4, x: -260, y: -300, flag: 'white' },
            { id: 5, x: -110, y: -450, flag: 'orange' },
            { id: 6, x: 110, y: -450, flag: 'blue' },
            { id: 7, x: 260, y: -300, flag: 'yellow' },
            { id: 8, x: 400, y: -130, flag: 'red' },
            { id: 9, x: 500, y: 70, flag: 'white' },
            { id: 10, x: 450, y: 300, flag: 'orange' }
        ];

        const jathakaStories = [
            {
                si: { title: "මහා සීලව රජුගේ ධාර්මික පාලනය (ආරම්භය)", text: "බරණැස් නුවර රජකම් කළ බෝධිසත්වයන් වහන්සේ ‘මහා සීලව’ නමින් ඉතා දැහැමි පාලනයක් ගෙන ගියහ. උන්වහන්සේ නගරයේ දොරටු සතරෙහි ද, නගර මධ්‍යයේ සහ රජ මැදුර ඉදිරිපිට ද දාන ශාලා සයක් කරවා දිළිඳුන්ට සහ මගීන්ට මහා දානය පිරිනැමූහ. තමා මෙන්ම මුළු රටම සිල්වත් කරමින්, දසරාජ ධර්මයෙන් යුතුව සියලු සත්වයන් කෙරෙහි මෛත්‍රියෙන් පාලනය මෙහෙයවූහ." },
                en: { title: "The Righteous Rule of King Maha Silawa", text: "The Bodhisattva, ruling in the city of Benares under the name 'Maha Silawa', maintained a very righteous administration. He built six alms halls—at the four city gates, in the city center, and in front of the royal palace—and offered great charity to the poor and travelers. Leading by example, he ruled with compassion and the Ten Royal Virtues." }
            },
            {
                si: { title: "කොසොල් සේනාව පැමිණ නගරය වැටලීම", text: "රජුගෙන් දඬුවම් ලැබ පිටුවහල් කළ දූෂිත ඇමතියෙකුගේ කේලාම් ඇසූ කොසොල් රජු, බරණැස් රාජ්‍යය අල්ලා ගැනීමට මහා සේනාවක් පිරිවරාගෙන නගරය වට කළේය. \"බරණැස් රජු ඉතා මෘදු කෙනෙකි, යුද්ධ නොකරයි\" යන වචනය විශ්වාස කළ සතුරු රජු යුධ බෙර හඬවමින් නගරය ආක්‍රමණය කිරීමට සැරසුණේය." },
                en: { title: "The Kosala Army Sieges the City", text: "Listening to the slander of a corrupt minister who had been banished by King Silawa, the King of Kosala surrounded the city with a great army to conquer the Kingdom of Benares. Believing the words that 'The King of Benares is very gentle and will not fight,' the enemy king prepared to invade the city sounding war drums." }
            },
            {
                si: { title: "ලේ වැගිරීම් වැළැක්වීමට ආත්ම පරිත්‍යාගයෙන් යටත් වීම", text: "තමා සතු දක්ෂ යෝධයන්ට සහ සේනාවට සතුරන් සමග යුද්ධ කිරීමට අවසර නොදුන් රජතුමා, \"මා නිසා අන් කිසිවෙකුගේ ජීවිත විනාශ නොවිය යුතුය\" යන උතුම් චේතනාවෙන් පසුවිය. රජතුමා තම ඇමතියන් පිරිස සමග කිසිදු ආයුධයක් රහිතව, ඉවසීමෙන් යුතුව මහවාසලට වී සිටිමින් සතුරු රජුට නගරයට ඇතුළු වීමට ඉඩ දී තමන්වම පූජා කළහ." },
                en: { title: "Surrendering to Prevent Bloodshed", text: "Refusing to allow his skilled warriors and army to fight the enemy, the king held the noble intention that 'No one's life should be destroyed because of me.' The king, along with his ministers, waited unarmed and patiently at the main gate, allowing the enemy king to enter the city, sacrificing himself for peace." }
            },
            {
                si: { title: "අමු සොහොනේ ජීවමානව වළ දැමීම", text: "නගරයට ඇතුළු වූ සතුරු රජු, කිසිදු වරදක් නොකළ සීලව රජු සහ ඇමතියන් දහස අල්ලාගෙන, ඔවුන්ගේ දෑත් පසුපසට කර බැඳ අමු සොහොනට ගෙන ගොස්, ගෙල පමණක් ඉතිරි වන සේ වළවල් හාරා පස් දමා තද කර පණපිටින් වළ දැමීමට නියම කළේය. මෙය රාත්‍රියේ හිවලුන්ට ආහාර වීම සඳහා කළ දරුණු දඬුවමකි." },
                en: { title: "Buried Alive in the Cemetery", text: "Entering the city, the enemy king captured the innocent King Silawa and his thousand ministers, tied their hands behind their backs, and took them to the cemetery. He ordered them to be buried alive up to their necks, packing the earth tightly around them. This was a cruel punishment meant to make them food for jackals at night." }
            },
            {
                si: { title: "මධ්‍යම රාත්‍රියේ හිවලුන්ගේ ආගමනය", text: "මළ සිරුරු අනුභවය සඳහා මධ්‍යම රාත්‍රියේදී හිවලුන් රෑනක් අමු සොහොනට පැමිණියහ. පණපිටින් වළ දමා සිටි රජු සහ ඇමතියන් දුටු හිවල්ලු ඔවුන් අසලට ළඟා වූහ. මෙය මරණය අභියස තිබූ අතිශය භීෂණාත්මක අවස්ථාවකි." },
                en: { title: "The Arrival of Jackals at Midnight", text: "At midnight, a pack of jackals arrived at the cemetery to feed on corpses. Seeing the king and ministers buried alive, the jackals approached them. It was a terrifying moment on the brink of death." }
            },
            {
                si: { title: "අප්‍රතිහත වීර්යයෙන් මරණය පරාජය කිරීම", text: "හිවල් නායකයා රජුගේ ගෙල ඩැහැගැනීමට පැමිණි විට, රජතුමා තම හකු ඇටයෙන් හිවලාගේ ගෙල තදින් අල්ලා ගත්තේය. හිවලා බියෙන් දඟලන විට පස් බුරුල් වූ අතර, රජතුමා තම අසීමිත කායික ශක්තිය සහ වීර්යය යොදා පොළොවෙන් මතු විය. ඉන්පසු තම ඇමතියන් පිරිස ද වළවල් වලින් නිදහස් කර ගත්තේය." },
                en: { title: "Defeating Death through Relentless Effort", text: "When the leader of the jackals came to bite the king's neck, the king firmly clamped his jaws around the jackal's neck. As the jackal struggled in fear, the earth loosened. The king then used his immense physical strength and relentless effort to emerge from the earth, and subsequently freed his ministers." }
            },
            {
                si: { title: "යක්ෂයන් දෙදෙනෙකුගේ ආරවුල විසඳීම", text: "එම අවස්ථාවේදී යක්ෂයන් දෙදෙනෙකුට ලැබුණු මළ සිරුරක් බෙදා ගැනීමට නොහැකිව ඔවුහු රජු වෙත පැමිණියහ. රජතුමා සතුරු රජුගේ මංගල කඩුව ගෙන්වාගෙන, ඉතා සාධාරණ ලෙස මළ සිරුර දෙකට බෙදා දී ඔවුන්ව සතුටු කළේය. රජුගේ යුක්තිගරුක බවට පැහැදුණු යක්ෂයෝ රජුට උපකාර කිරීමට පොරොන්දු වූහ." },
                en: { title: "Resolving the Dispute of Two Demons", text: "At that time, two demons who could not divide a corpse they had found came to the king. The king had the enemy king's royal sword brought to him and fairly divided the corpse in two, satisfying them. Impressed by the king's sense of justice, the demons promised to help him." }
            },
            {
                si: { title: "සතුරු රජුගේ යහන් ගැබට පිවිසීම", text: "යක්ෂයන්ගේ ආනුභාවයෙන් රජතුමා සතුරු රජු නිදා සිටි සිරියහන් ගැබට රහසින් පිවිසුණේය. තමා මරා දැමීමට තැත් කළ සතුරා අසරණව නිදා සිටියදී, රජු ඔහුට වෛර නොකළේය. ඔහු කඩුවෙන් සතුරු රජුගේ උදරයට තට්ටු කර ඔහු අවදි කළේ, තම මෛත්‍රිය සහ අභීත බව පෙන්වමිනි." },
                en: { title: "Entering the Enemy King's Bedchamber", text: "With the power of the demons, the king secretly entered the bedchamber where the enemy king was sleeping. Even as the enemy who tried to kill him lay vulnerable, the king held no hatred. He gently tapped the enemy king's stomach with his sword to wake him, demonstrating his compassion and fearlessness." }
            },
            {
                si: { title: "සතුරු රජු දමනය වී රාජ්‍යය නැවත භාර දීම", text: "අගුළු දැමූ කාමරයට මහා සීලව රජු පැමිණි ආකාරය සහ ඔහු දැක්වූ අසීමිත ඉවසීම දුටු කොසොල් රජු දැඩි සේ කම්පාවට පත් විය. \"මිනිසුන් නොහඳුනන ඔබේ ගුණය යකුන් පවා හඳුනාගෙන ඇත\" යැයි පවසමින් සතුරු රජු දණින් වැටී සමාව ගෙන, රාජ්‍යය නැවත භාර දී ආරක්ෂාව ද පොරොන්දු වී තම රටට ගියේය." },
                en: { title: "The Enemy King Submits and Returns the Kingdom", text: "Seeing how King Maha Silawa had entered the locked room and witnessing his boundless patience, the King of Kosala was deeply shaken. Saying, 'Even demons have recognized your virtue which humans failed to see,' the enemy king fell to his knees, apologized, returned the kingdom, promised protection, and returned to his own country." }
            },
            {
                si: { title: "ධර්මයේ සහ වීර්යයේ විජයග්‍රහණය", text: "නැවත රාජ්‍යය ලැබූ සීලව රජතුමා, \"වීර්යය අත් නොහළ යුතුය\" යන්න ලොවට පසක් කරමින් ධාර්මිකව රජකම් කළහ. සතුරන් පවා මිතුරන් වූ ඒ රාජ්‍යය සශ්‍රීක වූ අතර, සියලු දෙනා ධර්මයේ මඟ පෙන්වීම යටතේ සාමකාමීව ජීවත් වූහ." },
                en: { title: "The Triumph of Righteousness and Effort", text: "Having regained his kingdom, King Silawa ruled righteously, proving to the world that 'One should never give up effort.' In that kingdom where even enemies became friends, prosperity flourished, and everyone lived peacefully under the guidance of the Dhamma." }
            }
        ];

        panelPositions.forEach(pos => {
            let pX = centerX + (pos.x * scale);
            let pY = centerY + (pos.y * scale);
            const panelColor = nextColor();

            // Story Ring Inner
            createCircleGroup(pX, pY, panelRadius, 10, panelColor, `panel-${pos.id}-inner`);

            // Lotus Petal wrapping the circle
            createLotusWrapper(pX, pY, panelRadius * 1.15, panelColor, `panel-${pos.id}-lotus`);

            // Outer decorative ring
            createCircleGroup(pX, pY, panelRadius * 1.35, 10, 'white', `panel-${pos.id}-outer`);

            let storyInfo = jathakaStories[pos.id - 1];

            storyPanels.push({
                id: pos.id,
                x: pX,
                y: pY,
                radius: panelRadius,
                storyInfo: storyInfo,
                image: loadedImages[pos.id - 1],
                audio: `/Audio/${pos.id}.mp3`
            });
        });

        // 3. Makara Thorana / Sweeping Interconnects
        // Long sweeps connecting the sides (Now rooted directly under the Buddha)
        createCurveGroup(centerX - 50 * scale, centerY + 240 * scale, centerX - 800 * scale, centerY + 200 * scale, centerX - 250 * scale, centerY - 320 * scale, 'yellow', 'sweep-left');
        createCurveGroup(centerX - 30 * scale, centerY + 230 * scale, centerX - 750 * scale, centerY + 180 * scale, centerX - 270 * scale, centerY - 290 * scale, 'red', 'sweep-left-inner');

        createCurveGroup(centerX + 50 * scale, centerY + 240 * scale, centerX + 800 * scale, centerY + 200 * scale, centerX + 250 * scale, centerY - 320 * scale, 'yellow', 'sweep-right');
        createCurveGroup(centerX + 30 * scale, centerY + 230 * scale, centerX + 750 * scale, centerY + 180 * scale, centerX + 270 * scale, centerY - 290 * scale, 'red', 'sweep-right-inner');

        // Top arc uniting the top panels
        createCurveGroup(centerX - 110 * scale, centerY - 450 * scale, centerX, centerY - 600 * scale, centerX + 110 * scale, centerY - 450 * scale, 'white', 'sweep-top');

        // 4. Elaborate Makara Thorana / Liyawela Carvings
        function createLiyawelaSide(side) {
            let dir = side === 'left' ? -1 : 1;
            let p = (x, y) => { return { x: centerX + (x * dir * scale), y: centerY + (y * scale) }; };
            let grp = (name) => `liya-${side}-${name}`;

            // Main upward sweeping vine (Rooted right under the Buddha's lotus)
            let mS = p(60, 220); // starts close to the center under the lotus
            let mC = p(280, 280); // sweeps down and out around the base
            let mSpC = p(280, 50); // spiral center
            let mAng = Math.PI / 2; // attaches at the bottom of the spiral
            createVineWithSpiral(mS.x, mS.y, mC.x, mC.y, mSpC.x, mSpC.y, 45 * scale, 1.5, mAng, -dir, 'yellow', grp('main'));

            // Second vine sprouting from the main vine
            let sS = p(150, 210);
            let sC = p(400, 160);
            let sSpC = p(350, -20);
            let sAng = Math.PI / 2;
            createVineWithSpiral(sS.x, sS.y, sC.x, sC.y, sSpC.x, sSpC.y, 35 * scale, 1.5, sAng, dir, 'blue', grp('sec'));

            // Third vine curling inwards towards Buddha (Red) - Extended to base
            let tS = p(50, 230); // Originates deeply under the lotus
            let tC = p(180, 150); // Sweeps gracefully outwards and up
            let tSpC = p(200, -60);
            let tAng = (side === 'left') ? Math.PI : 0; // Attaches at outer edge relative to center
            createVineWithSpiral(tS.x, tS.y, tC.x, tC.y, tSpC.x, tSpC.y, 25 * scale, 1.5, tAng, -dir, 'red', grp('tert'));

            // Outer sweeping leaf (Peti) - Rooted deeply under the Buddha
            let lS = p(30, 250); // Originates deeply from the center under the lotus
            let lC = p(480, 200); // Sweeps very far down and outwards to frame the liyawela
            let lE = p(400, -80); // Curls back up towards the middle
            createCurveGroup(lS.x, lS.y, lC.x, lC.y, lE.x, lE.y, 'green', grp('leaf'));

            // Base fill curl (White) - Extended deeper under lotus
            let bS = p(40, 240); // Originates from the very center under the lotus
            let bC = p(180, 340); // Sweeps deeply downwards and out
            let bSpC = p(280, 240);
            createVineWithSpiral(bS.x, bS.y, bC.x, bC.y, bSpC.x, bSpC.y, 20 * scale, 1.0, Math.PI / 2, -dir, 'white', grp('base'));
        }

        createLiyawelaSide('left');
        createLiyawelaSide('right');

        // 5. Name Board (Thoran Geya) Frame and Buddhist Flags
        let geyaWidth = 720 * scale;
        let geyaY = centerY + 250 * scale;
        let horizonY = centerY + 410 * scale;
        let boardLeft = centerX - geyaWidth / 2;
        let boardRight = centerX + geyaWidth / 2;

        // Rectangular frame around the name board
        createLineGroup(boardLeft, geyaY, boardRight, geyaY, 'yellow', 'name-board-top');
        createLineGroup(boardRight, geyaY, boardRight, horizonY, 'yellow', 'name-board-right');
        createLineGroup(boardRight, horizonY, boardLeft, horizonY, 'yellow', 'name-board-bottom');
        createLineGroup(boardLeft, horizonY, boardLeft, geyaY, 'yellow', 'name-board-left');

        // Buddhist Flags on the sides of the name board
        function createBuddhistFlag(bx, by, flagWidth, flagHeight, groupPrefix) {
            let colors = ['blue', 'yellow', 'red', 'white', 'orange'];
            let stripeWidth = flagWidth / 6; // 6 stripes in a Buddhist flag!

            // First 5 solid vertical stripes
            for (let i = 0; i < 5; i++) {
                // 3 vertical lines per stripe for density
                createLineGroup(bx + i * stripeWidth, by, bx + i * stripeWidth, by + flagHeight, colors[i], `${groupPrefix}-stripe-${i}`);
                createLineGroup(bx + i * stripeWidth + stripeWidth / 3, by, bx + i * stripeWidth + stripeWidth / 3, by + flagHeight, colors[i], `${groupPrefix}-stripe-${i}`);
                createLineGroup(bx + i * stripeWidth + 2 * stripeWidth / 3, by, bx + i * stripeWidth + 2 * stripeWidth / 3, by + flagHeight, colors[i], `${groupPrefix}-stripe-${i}`);
            }

            // 6th stripe (Prabhashvara - composed of the 5 colors horizontally)
            let i = 5;
            let blockHeight = flagHeight / 5;
            for (let j = 0; j < 5; j++) {
                // 3 vertical lines per block in the 6th stripe
                createLineGroup(bx + i * stripeWidth, by + j * blockHeight, bx + i * stripeWidth, by + (j + 1) * blockHeight, colors[j], `${groupPrefix}-stripe-6-${j}`);
                createLineGroup(bx + i * stripeWidth + stripeWidth / 3, by + j * blockHeight, bx + i * stripeWidth + stripeWidth / 3, by + (j + 1) * blockHeight, colors[j], `${groupPrefix}-stripe-6-${j}`);
                createLineGroup(bx + i * stripeWidth + 2 * stripeWidth / 3, by + j * blockHeight, bx + i * stripeWidth + 2 * stripeWidth / 3, by + (j + 1) * blockHeight, colors[j], `${groupPrefix}-stripe-6-${j}`);
            }
        }

    }

    // --- Helper Functions for Shapes ---
    function addBulb(x, y, colorName, groupName, index, total) {
        bulbs.push({ x, y, color: colorName, group: groupName, index, totalInGroup: total });
    }

    function createCircleGroup(cx, cy, radius, spacing, colorName, groupName) {
        let numBulbs = Math.floor((2 * Math.PI * (radius / scale)) / bulbSpacing);
        for (let i = 0; i < numBulbs; i++) {
            let angle = (i / numBulbs) * Math.PI * 2;
            addBulb(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, colorName, groupName, i, numBulbs);
        }
    }

    function createLineGroup(startX, startY, endX, endY, colorName, groupName) {
        let dist = Math.hypot(endX - startX, endY - startY);
        let numBulbs = Math.floor((dist / scale) / bulbSpacing);
        for (let i = 0; i <= numBulbs; i++) {
            let t = i / numBulbs;
            addBulb(startX + (endX - startX) * t, startY + (endY - startY) * t, colorName, groupName, i, numBulbs);
        }
    }

    function samplePoints(points, numBulbs, colorName, groupName, skipFirst = false, skipLast = false) {
        if (numBulbs <= 0) return;
        let totalDist = points[points.length - 1].d;
        let pIndex = 0;
        let startI = skipFirst ? 1 : 0;
        let endI = skipLast ? numBulbs - 1 : numBulbs;
        for (let i = startI; i <= endI; i++) {
            let targetD = (i / numBulbs) * totalDist;
            while (pIndex < points.length - 1 && points[pIndex + 1].d < targetD) {
                pIndex++;
            }
            let p1 = points[pIndex];
            let p2 = points[Math.min(pIndex + 1, points.length - 1)];

            let segmentD = p2.d - p1.d;
            let factor = segmentD === 0 ? 0 : (targetD - p1.d) / segmentD;

            let bx = p1.x + (p2.x - p1.x) * factor;
            let by = p1.y + (p2.y - p1.y) * factor;

            addBulb(bx, by, colorName, groupName, i, numBulbs);
        }
    }

    function createTextBulbs(text, fontStr, cx, cy, colorName, groupName, sampleStep, renderScale) {
        let tCanvas = document.createElement('canvas');
        let tCtx = tCanvas.getContext('2d', { willReadFrequently: true });

        // Use a massive canvas to render text cleanly at high resolution
        tCanvas.width = 1600;
        tCanvas.height = 200;

        tCtx.font = fontStr;
        tCtx.fillStyle = 'white';
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        tCtx.fillText(text, 800, 100);

        let imgData = tCtx.getImageData(0, 0, 1600, 200).data;
        let points = [];

        // Scan pixels finely on the high-res canvas
        for (let y = 0; y < 200; y += sampleStep) {
            for (let x = 0; x < 1600; x += sampleStep) {
                let alpha = imgData[(Math.floor(y) * 1600 + Math.floor(x)) * 4 + 3];
                if (alpha > 128) {
                    // Scale down the coordinates to fit the actual pandal base!
                    points.push({ x: (x - 800) * renderScale, y: (y - 100) * renderScale });
                }
            }
        }

        let total = points.length;
        points.forEach((pt, idx) => {
            addBulb(cx + pt.x, cy + pt.y, colorName, groupName, idx, total);
        });
    }

    function createCurveGroup(startX, startY, controlX, controlY, endX, endY, colorName, groupName) {
        let steps = 100, dist = 0, lastX = startX, lastY = startY;
        let points = [{ x: startX, y: startY, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let cx = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
            let cy = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;
            dist += Math.hypot(cx - lastX, cy - lastY);
            points.push({ x: cx, y: cy, d: dist });
            lastX = cx; lastY = cy;
        }
        let actualSpacing = isMobile ? 18 : 10;
        let numBulbs = Math.floor((dist / scale) / actualSpacing);
        samplePoints(points, numBulbs, colorName, groupName);
    }

    function createWaveGroup(startX, startY, endX, endY, frequency, amplitude, colorName, groupName) {
        let dx = endX - startX, dy = endY - startY;
        let angle = Math.atan2(dy, dx);
        let steps = 100, dist = 0, lastX = startX, lastY = startY + Math.sin(0) * amplitude;
        let points = [{ x: lastX, y: lastY, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let waveOffset = Math.sin(t * Math.PI * 2 * frequency) * amplitude;
            let cx = startX + dx * t + Math.cos(angle + Math.PI / 2) * waveOffset;
            let cy = startY + dy * t + Math.sin(angle + Math.PI / 2) * waveOffset;
            dist += Math.hypot(cx - lastX, cy - lastY);
            points.push({ x: cx, y: cy, d: dist });
            lastX = cx; lastY = cy;
        }
        let actualSpacing = isMobile ? 18 : 10;
        let numBulbs = Math.floor((dist / scale) / actualSpacing);
        samplePoints(points, numBulbs, colorName, groupName);
    }

    function createSpiralGroup(cx, cy, maxRadius, coils, colorName, direction, groupName) {
        let steps = 100, dist = 0, lastX = cx, lastY = cy;
        let points = [{ x: cx, y: cy, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let angle = t * Math.PI * 2 * coils * direction;
            let r = t * maxRadius;
            let curX = cx + Math.cos(angle) * r;
            let curY = cy + Math.sin(angle) * r;
            dist += Math.hypot(curX - lastX, curY - lastY);
            points.push({ x: curX, y: curY, d: dist });
            lastX = curX; lastY = curY;
        }
        let actualSpacing = isMobile ? 18 : 10;
        let numBulbs = Math.floor((dist / scale) / actualSpacing);
        samplePoints(points, numBulbs, colorName, groupName);
    }

    function createVineWithSpiral(startX, startY, ctrlX, ctrlY, spiralCenterX, spiralCenterY, maxRadius, coils, attachAngle, spiralDir, colorName, groupName) {
        let endX = spiralCenterX + Math.cos(attachAngle) * maxRadius;
        let endY = spiralCenterY + Math.sin(attachAngle) * maxRadius;

        createCurveGroup(startX, startY, ctrlX, ctrlY, endX, endY, colorName, groupName + '-vine');

        let steps = 100, dist = 0, lastX = endX, lastY = endY;
        let points = [{ x: endX, y: endY, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let r = (1 - t) * maxRadius;
            let angle = attachAngle + t * Math.PI * 2 * coils * spiralDir;
            let curX = spiralCenterX + Math.cos(angle) * r;
            let curY = spiralCenterY + Math.sin(angle) * r;
            dist += Math.hypot(curX - lastX, curY - lastY);
            points.push({ x: curX, y: curY, d: dist });
            lastX = curX; lastY = curY;
        }
        let actualSpacing = isMobile ? 18 : 10;
        let numBulbs = Math.floor((dist / scale) / actualSpacing);
        samplePoints(points, numBulbs, colorName, groupName + '-sp');
    }

    function createLotusWrapper(cx, cy, radius, colorName, groupName) {
        let topY = cy - radius * 1.5;
        let bottomY = cy + radius;
        let steps = 100;

        let p0 = { x: cx, y: topY };
        let p1L = { x: cx - radius * 1.5, y: topY + radius * 0.8 };
        let p2L = { x: cx - radius * 1.3, y: bottomY - radius * 0.2 };
        let p3 = { x: cx, y: bottomY };

        let distL = 0, lastXL = cx, lastYL = topY;
        let pointsL = [{ x: cx, y: topY, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let u = 1 - t;
            let currentX = u * u * u * p0.x + 3 * u * u * t * p1L.x + 3 * u * t * t * p2L.x + t * t * t * p3.x;
            let currentY = u * u * u * p0.y + 3 * u * u * t * p1L.y + 3 * u * t * t * p2L.y + t * t * t * p3.y;

            distL += Math.hypot(currentX - lastXL, currentY - lastYL);
            pointsL.push({ x: currentX, y: currentY, d: distL });
            lastXL = currentX; lastYL = currentY;
        }
        let actualSpacing = isMobile ? 18 : 10;
        let numBulbsL = Math.floor((distL / scale) / actualSpacing);
        samplePoints(pointsL, numBulbsL, colorName, groupName + '-left');

        let p1R = { x: cx + radius * 1.5, y: topY + radius * 0.8 };
        let p2R = { x: cx + radius * 1.3, y: bottomY - radius * 0.2 };

        let distR = 0, lastXR = cx, lastYR = topY;
        let pointsR = [{ x: cx, y: topY, d: 0 }];
        for (let i = 1; i <= steps; i++) {
            let t = i / steps;
            let u = 1 - t;
            let currentX = u * u * u * p0.x + 3 * u * u * t * p1R.x + 3 * u * t * t * p2R.x + t * t * t * p3.x;
            let currentY = u * u * u * p0.y + 3 * u * u * t * p1R.y + 3 * u * t * t * p2R.y + t * t * t * p3.y;

            distR += Math.hypot(currentX - lastXR, currentY - lastYR);
            pointsR.push({ x: currentX, y: currentY, d: distR });
            lastXR = currentX; lastYR = currentY;
        }
        let numBulbsR = Math.floor((distR / scale) / actualSpacing);
        samplePoints(pointsR, numBulbsR, colorName, groupName + '-right', true, true);
    }

    function createLotusBase(startX, endX, yPos, height, colorName, groupName) {
        let width = endX - startX;
        let numPetals = 5;
        let pWidth = width / numPetals;
        for (let p = 0; p < numPetals; p++) {
            let cx = startX + (p * pWidth) + pWidth / 2;
            createLotusWrapper(cx, yPos, pWidth * 0.6, colorName, groupName + p);
        }
    }

    // --- Animation Rendering ---
    function loop() {
        // Boost speed on strong bass hits only for Audio-Visual Sync pattern!
        let dynamicSpeedMultiplier = 1.0;
        if (currentPattern === 'audioSync') {
            dynamicSpeedMultiplier = 1.0 + (currentAudioEnergy * 4.0);
        }
        time += 0.25 * currentSpeed * dynamicSpeedMultiplier; // Adjusted for smooth 60fps speed, influenced by speed controller

        // Animate the golden-white circular light ripple wave from Temple Bell
        if (bellRippleActive) {
            bellRippleProgress += 15 * scale;
            bellRippleIntensity *= 0.985; // resonant sound wave decay
            if (bellRippleIntensity < 0.02) {
                bellRippleActive = false;
                bellRippleIntensity = 0;
            }
        }

        drawBackground();
        drawFireworks();

        // Draw the majestic procedural Bo tree BEHIND the Thorana
        drawBoTree(time);

        // Draw the actual wooden Pandal framework (Thoran Geya / Scaffolding)
        drawThoranaStructure();

        // High quality glow rendering for background bulbs (sweeps, spirals, base, etc.)
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < bulbs.length; i++) {
            if (!bulbs[i].group.startsWith('panel')) {
                drawBulb(bulbs[i], time);
            }
        }

        // Draw story images over the background sweeps
        ctx.globalCompositeOperation = 'source-over';
        drawStoryImages();

        // High quality glow rendering for foreground panel bulbs (inner/outer rings, lotus)
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < bulbs.length; i++) {
            if (bulbs[i].group.startsWith('panel')) {
                drawBulb(bulbs[i], time);
            }
        }

        ctx.globalCompositeOperation = 'lighter';
        drawAudioAura(time);
        ctx.globalCompositeOperation = 'source-over';

        // Draw main Buddha image last so it overlaps the background halos
        drawBuddhaPlaceholder();

        // Draw elegant falling lotus petals and glowing sparks around the Buddha
        drawAmbientParticles(time);

        // Draw custom typography image at the base!
        if (mahaImg.complete && mahaImg.naturalWidth > 0) {
            let mScale = (500 * scale) / mahaImg.width; // Scale to fit the base nicely between flags
            let mw = mahaImg.width * mScale;
            let mh = mahaImg.height * mScale;
            // Draw it perfectly centered in the maroon name board (balanced compensation offset for left padding in MAHA.webp)
            ctx.drawImage(mahaImg, centerX - mw / 2 - 10 * scale, centerY + 280 * scale, mw, mh);
        }

        // Draw the animated lake and reflection at the bottom!
        drawLake(time);

        // Draw additional shrines (Stupa, Bell Tower, Dharma Chakra, Buddhist Flag)
        drawAdditionalShrines(time);

        animationFrameId = requestAnimationFrame(loop);
    }

    function drawBackground() {
        if (bgCache) {
            ctx.drawImage(bgCache, 0, 0);
        }

        if (!isDayTime) {
            // Draw Stars in 3 optimized batches to save 97% draw calls!
            let buckets = [[], [], []];
            stars.forEach((star, idx) => {
                buckets[idx % 3].push(star);
            });

            ctx.fillStyle = '#ffffff';
            buckets.forEach((bucket, bIdx) => {
                let opacity = (Math.sin(time * 0.04 + bIdx) + 1) / 2;
                ctx.globalAlpha = 0.25 + opacity * 0.75;
                ctx.beginPath();
                bucket.forEach(star => {
                    ctx.moveTo(star.x + star.size, star.y);
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                });
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            // Draw Fireflies (කළාමැදිරියෝ) using pre-rendered offscreen canvas for 50x faster GPU rendering!
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            fireflies.forEach(f => {
                f.x += f.speedX + Math.sin(time * 0.02 + f.phase) * 0.5;
                f.y += f.speedY + Math.cos(time * 0.02 + f.phase) * 0.5;

                // Keep in bounds
                if (f.x < 0) f.x = width;
                if (f.x > width) f.x = 0;
                if (f.y < height * 0.3) f.y = height;
                if (f.y > height) f.y = height * 0.3;

                let blink = (Math.sin(time * f.blinkSpeed + f.phase) + 1) / 2;
                if (fireflyCacheCanvas && blink > 0.05) {
                    ctx.globalAlpha = blink;
                    let size = 16 * scale;
                    ctx.drawImage(fireflyCacheCanvas, f.x - size / 2, f.y - size / 2, size, size);
                }
            });
            ctx.restore();

            // Owl hooting occasionally
            if (Math.random() < 0.0005) { // Roughly every ~30 seconds at 60fps
                playOwlSound();
            }
        } else {
            // Draw flying birds
            ctx.fillStyle = '#1a3b5c'; // Dark bird silhouette
            birds.forEach(bird => {
                bird.x -= bird.speed;
                if (bird.x < -50) {
                    bird.x = width + 50;
                    bird.y = height * 0.05 + Math.random() * height * 0.3;
                }

                let wingY = Math.sin(time * bird.wingSpeed + bird.phase) * 10 * scale;
                ctx.beginPath();
                ctx.moveTo(bird.x, bird.y);
                ctx.quadraticCurveTo(bird.x + 10 * scale, bird.y - 5 * scale, bird.x + 20 * scale, bird.y + wingY);
                ctx.quadraticCurveTo(bird.x + 10 * scale, bird.y - 2 * scale, bird.x, bird.y);
                ctx.quadraticCurveTo(bird.x - 10 * scale, bird.y - 5 * scale, bird.x - 20 * scale, bird.y + wingY);
                ctx.quadraticCurveTo(bird.x - 10 * scale, bird.y - 2 * scale, bird.x, bird.y);
                ctx.fill();
            });

            // Bird chirping occasionally during the day
            if (Math.random() < 0.003) { // Roughly every ~5 seconds at 60fps
                playBirdSound();
            }
        }

        // Draw ambient floating lanterns (Vesak Koodu)
        if (lanternCache) {
            lanterns.forEach(lantern => {
                lantern.y -= lantern.speedY;
                lantern.x += Math.sin(time * lantern.wobbleSpeed + lantern.wobblePhase) * 0.5;

                if (lantern.y < -100) {
                    lantern.y = height + 100;
                    lantern.x = Math.random() * width;
                }

                let w = lanternCache.width * lantern.scale;
                let h = lanternCache.height * lantern.scale;
                ctx.drawImage(lanternCache, lantern.x - w / 2, lantern.y - h / 2, w, h);
            });
        }
        // Draw offered floating sky lanterns
        drawFloatingSkyLanterns(time);
    }

    function drawThoranaStructure() {
        let horizonY = centerY + 410 * scale;

        ctx.save();

        // Bamboo/Wood color
        let poleColor = isDayTime ? '#2c1e11' : '#080503';
        let highlightColor = isDayTime ? '#3a2a1a' : '#0d0905';
        let shadowColor = isDayTime ? '#1a1008' : '#030201';

        let startX = centerX - 450 * scale;
        let endX = centerX + 450 * scale;
        let startY = centerY - 400 * scale;
        let endY = horizonY;

        // We only want the bamboo structure to be behind the pandal, forming a nice semi-circle arch.
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20 * scale, 420 * scale, Math.PI, 0); // Top arch covering the stories
        ctx.lineTo(endX, horizonY);
        ctx.lineTo(startX, horizonY);
        ctx.closePath();
        ctx.clip();

        // Draw scaffolding grid (Horizontal and Vertical)
        for (let y = startY; y <= endY; y += 70 * scale) {
            ctx.fillStyle = poleColor;
            ctx.fillRect(startX, y, endX - startX, 4 * scale);
            ctx.fillStyle = highlightColor;
            ctx.fillRect(startX, y, endX - startX, 1 * scale);
            ctx.fillStyle = shadowColor;
            ctx.fillRect(startX, y + 3 * scale, endX - startX, 1 * scale);
        }

        for (let x = startX; x <= endX; x += 70 * scale) {
            ctx.fillStyle = poleColor;
            ctx.fillRect(x, startY, 4 * scale, endY - startY);
            ctx.fillStyle = highlightColor;
            ctx.fillRect(x, startY, 1 * scale, endY - startY);
            ctx.fillStyle = shadowColor;
            ctx.fillRect(x + 3 * scale, startY, 1 * scale, endY - startY);
        }

        // Diagonal bracings for realism (X crosses)
        ctx.lineWidth = 1.5 * scale;
        ctx.strokeStyle = shadowColor;
        for (let x = startX; x < endX; x += 140 * scale) {
            for (let y = startY; y < endY; y += 140 * scale) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 140 * scale, y + 140 * scale);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 140 * scale, y);
                ctx.lineTo(x, y + 140 * scale);
                ctx.stroke();
            }
        }

        ctx.restore();

        // Draw "Thoran Geya" (Name Board / Base)
        // This is drawn outside the clip so it spans wide and sits on the ground
        ctx.save();
        let geyaWidth = 720 * scale;
        let geyaY = centerY + 250 * scale; // Sits nicely behind the typography and flags
        let geyaHeight = horizonY - geyaY;
        let geyaX = centerX - geyaWidth / 2;

        if (geyaHeight > 0) {
            // Main structure legs extending to the lake
            ctx.fillStyle = poleColor;
            ctx.fillRect(geyaX + 20 * scale, geyaY, 10 * scale, geyaHeight);
            ctx.fillRect(geyaX + geyaWidth - 30 * scale, geyaY, 10 * scale, geyaHeight);

            // Geya Walls (Deep Maroon/Red Name Board background)
            ctx.fillStyle = isDayTime ? '#5e0712' : '#290308';
            ctx.fillRect(geyaX, geyaY, geyaWidth, geyaHeight);

            // Decorative dark border
            ctx.strokeStyle = isDayTime ? '#330309' : '#0f0102';
            ctx.lineWidth = 4 * scale;
            ctx.strokeRect(geyaX + 4 * scale, geyaY + 4 * scale, geyaWidth - 8 * scale, geyaHeight - 8 * scale);

            // Subtle vertical plank lines
            ctx.fillStyle = isDayTime ? '#4a040d' : '#1a0104';
            for (let px = geyaX + 10 * scale; px < geyaX + geyaWidth - 10 * scale; px += 20 * scale) {
                ctx.fillRect(px, geyaY + 5 * scale, 1.5 * scale, geyaHeight - 10 * scale);
            }

            // Geya Roof (Slanted)
            ctx.fillStyle = isDayTime ? '#702d1d' : '#140805'; // Reddish-brown tile roof
            ctx.beginPath();
            ctx.moveTo(geyaX - 25 * scale, geyaY);
            ctx.lineTo(geyaX + geyaWidth + 25 * scale, geyaY);
            ctx.lineTo(geyaX + geyaWidth - 10 * scale, geyaY - 15 * scale);
            ctx.lineTo(geyaX + 10 * scale, geyaY - 15 * scale);
            ctx.fill();

            // Highlight for roof edges
            ctx.strokeStyle = isDayTime ? '#8f3e2a' : '#1a0b07';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawFireworks() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = fireworks.length - 1; i >= 0; i--) {
            let f = fireworks[i];

            if (f.state === 'launch') {
                // Draw launching rocket
                f.x += f.vx;
                f.y -= f.speed;
                f.speed *= 0.98; // Gravity/friction

                ctx.fillStyle = f.color;
                ctx.beginPath();
                ctx.arc(f.x, f.y, 2 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Trail
                ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
                ctx.beginPath();
                ctx.arc(f.x, f.y + 5, 1.5 * scale, 0, Math.PI * 2);
                ctx.fill();

                if (f.speed < 2) {
                    f.state = 'explode';
                    playFireworkSound('explode');
                    // Create particles
                    for (let p = 0; p < 150; p++) {
                        let angle = Math.random() * Math.PI * 2;
                        let speed = Math.random() * 6 + 1;
                        f.particles.push({
                            x: f.x,
                            y: f.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            alpha: 1,
                            life: Math.random() * 0.015 + 0.01
                        });
                    }
                }
            } else if (f.state === 'explode') {
                let allDead = true;
                for (let p of f.particles) {
                    if (p.alpha <= 0) continue;
                    allDead = false;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05; // Gravity
                    p.alpha -= p.life;

                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.fillStyle = f.color;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = f.color;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.5 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (allDead) {
                    fireworks.splice(i, 1);
                }
            }
        }
        ctx.fill();
        ctx.restore();
    }

    function drawOfferedLamps(time) {
        let lakeStart = centerY + 410 * scale;

        ctx.save();
        // Remove dead lamps or keep them if we want them to stay
        offeredLamps.forEach(lamp => {
            // Animate moving up from bottom
            if (lamp.y > lamp.targetY) {
                lamp.y -= 1 * scale;
                lamp.alpha = Math.min(1, lamp.alpha + 0.02);
            }

            // Drift slightly
            lamp.x += Math.sin(time * 0.02 + lamp.id) * 0.2 * scale;

            ctx.save();
            ctx.translate(lamp.x, lamp.y);
            ctx.scale(lamp.scale, lamp.scale);
            ctx.globalAlpha = lamp.alpha;

            // Draw Clay Lamp (මැටි පහන)
            // Base
            ctx.fillStyle = '#8B4513'; // SaddleBrown
            ctx.beginPath();
            ctx.ellipse(0, 0, 12 * scale, 6 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Oil inside
            ctx.fillStyle = '#D2691E'; // Chocolate/Oil
            ctx.beginPath();
            ctx.ellipse(0, -1 * scale, 10 * scale, 4 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Flame
            let flicker = Math.sin(time * 0.5 + lamp.id) * 0.2 + 0.8;
            ctx.globalCompositeOperation = 'lighter';

            // Glow
            let glowRad = ctx.createRadialGradient(0, -5 * scale, 0, 0, -5 * scale, 20 * scale * flicker);
            glowRad.addColorStop(0, 'rgba(255, 200, 50, 0.6)');
            glowRad.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = glowRad;
            ctx.beginPath();
            ctx.arc(0, -5 * scale, 20 * scale * flicker, 0, Math.PI * 2);
            ctx.fill();

            // Core Flame
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(0, -12 * scale * flicker);
            ctx.quadraticCurveTo(3 * scale, -5 * scale, 0, -2 * scale);
            ctx.quadraticCurveTo(-3 * scale, -5 * scale, 0, -12 * scale * flicker);
            ctx.fill();

            // Inner hot flame
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.moveTo(0, -8 * scale * flicker);
            ctx.quadraticCurveTo(1.5 * scale, -4 * scale, 0, -2 * scale);
            ctx.quadraticCurveTo(-1.5 * scale, -4 * scale, 0, -8 * scale * flicker);
            ctx.fill();

            ctx.restore();

            // Draw Reflection in lake
            if (lamp.y > lakeStart) {
                ctx.save();
                ctx.translate(lamp.x, lamp.y + (lamp.y - lakeStart) * 0.2);
                ctx.scale(lamp.scale, -lamp.scale * 0.4); // Flip and squash
                ctx.globalAlpha = lamp.alpha * 0.3;

                // Reflection flame
                ctx.fillStyle = '#FFA500';
                ctx.beginPath();
                ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        ctx.restore();
    }

    function drawCustomLotus(ctx, cx, cy, scaleFactor, color, time) {
        ctx.save();
        ctx.translate(cx, cy);
        
        let yOffset = Math.sin(time * 0.03 + cx) * 4;
        ctx.translate(0, yOffset);
        ctx.scale(scaleFactor, scaleFactor);

        let primaryGrad = ctx.createRadialGradient(0, 5, 0, 0, 5, 20);
        if (color === 'blue') {
            primaryGrad.addColorStop(0, '#e0f2fe'); // ice blue center
            primaryGrad.addColorStop(0.5, '#38bdf8'); // sky blue
            primaryGrad.addColorStop(1, '#0369a1'); // deep blue tips
        } else {
            primaryGrad.addColorStop(0, '#fdf2f8'); // white pink center
            primaryGrad.addColorStop(0.5, '#f472b6'); // rose pink
            primaryGrad.addColorStop(1, '#be185d'); // deep magenta tips
        }

        // Green base pad
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.ellipse(0, 8, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing ring
        ctx.strokeStyle = color === 'blue' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 114, 182, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 8, 30 + Math.sin(time * 0.05) * 3, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Petals shadow & fill
        ctx.fillStyle = primaryGrad;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color === 'blue' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(244, 114, 182, 0.6)';

        // 1. Back petals
        for (let angle of [-0.6, -0.3, 0, 0.3, 0.6]) {
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-8, -12, -4, -22, 0, -26);
            ctx.bezierCurveTo(4, -22, 8, -12, 0, 0);
            ctx.fill();
            ctx.restore();
        }

        // 2. Middle petals
        for (let angle of [-0.4, 0, 0.4]) {
            ctx.save();
            ctx.scale(0.9, 0.9);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-8, -10, -4, -20, 0, -24);
            ctx.bezierCurveTo(4, -20, 8, -10, 0, 0);
            ctx.fill();
            ctx.restore();
        }

        // 3. Yellow bud center
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, -2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawOfferedLotuses(time) {
        let lakeStart = centerY + 410 * scale;

        ctx.save();
        offeredLotuses.forEach(lotus => {
            if (lotus.y > lotus.targetY) {
                lotus.y -= 1 * scale;
                lotus.alpha = Math.min(1, lotus.alpha + 0.02);
            }
            lotus.x += Math.sin(time * 0.02 + lotus.id) * 0.2 * scale;

            ctx.save();
            ctx.globalAlpha = lotus.alpha;
            drawCustomLotus(ctx, lotus.x, lotus.y, lotus.scale, lotus.color, time);
            ctx.restore();

            // Draw Reflection
            if (lotus.y > lakeStart) {
                ctx.save();
                ctx.translate(lotus.x, lotus.y + (lotus.y - lakeStart) * 0.2);
                ctx.scale(lotus.scale, -lotus.scale * 0.4);
                ctx.globalAlpha = lotus.alpha * 0.3;

                ctx.fillStyle = lotus.color === 'blue' ? '#38bdf8' : '#f472b6';
                ctx.beginPath();
                ctx.ellipse(0, 0, 15 * scale, 6 * scale, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        ctx.restore();
    }

    function spawnSkyLanterns() {
        for (let i = 0; i < 3; i++) {
            floatingSkyLanterns.push({
                id: Math.random(),
                x: centerX + (Math.random() - 0.5) * (width * 0.7),
                y: height + 20 + Math.random() * 50,
                speedY: (0.8 + Math.random() * 1.2) * scale,
                speedX: (Math.random() - 0.5) * 0.3 * scale,
                size: (12 + Math.random() * 10) * scale,
                alpha: 0.1,
                targetAlpha: 0.7 + Math.random() * 0.3,
                wobbleSpeed: 0.01 + Math.random() * 0.02,
                wobblePhase: Math.random() * Math.PI * 2
            });
        }
    }

    function drawFloatingSkyLanterns(time) {
        ctx.save();
        for (let i = floatingSkyLanterns.length - 1; i >= 0; i--) {
            let l = floatingSkyLanterns[i];
            l.y -= l.speedY;
            l.x += l.speedX + Math.sin(time * l.wobbleSpeed + l.wobblePhase) * 0.3 * scale;

            if (l.y > height * 0.8) {
                l.alpha = Math.min(l.targetAlpha, l.alpha + 0.02);
            } else if (l.y < 100) {
                l.alpha -= 0.01;
            }

            if (l.y < -50 || l.alpha <= 0) {
                floatingSkyLanterns.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = l.alpha;
            ctx.translate(l.x, l.y);

            // Glow
            ctx.globalCompositeOperation = 'lighter';
            let flicker = Math.sin(time * 0.1 + l.id) * 0.15 + 0.85;
            let glow = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2 * flicker);
            glow.addColorStop(0, 'rgba(255, 140, 0, 0.7)');
            glow.addColorStop(0.5, 'rgba(255, 69, 0, 0.25)');
            glow.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, l.size * 2 * flicker, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
            ctx.strokeStyle = '#8b0000';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(-l.size * 0.6, -l.size);
            ctx.lineTo(l.size * 0.6, -l.size);
            ctx.lineTo(l.size * 0.8, l.size * 0.8);
            ctx.lineTo(-l.size * 0.8, l.size * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Bottom candle fire
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.ellipse(0, l.size * 0.8, l.size * 0.4, l.size * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
        ctx.restore();
    }

    function playBellSound() {
        try {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            let now = audioCtx.currentTime;

            // Synthesis parameters for a majestic 2-ton golden Temple Bell (ඝන්ටාරය)
            const fundamental = 150; // Deep majestic pitch
            const partials = [
                { freq: fundamental * 1.0, gain: 0.5, decay: 6.0 }, // Deep hum
                { freq: fundamental * 2.0, gain: 0.35, decay: 4.5 }, // Clear second partial
                { freq: fundamental * 2.76, gain: 0.25, decay: 3.0 }, // Metallic chime
                { freq: fundamental * 3.0, gain: 0.2, decay: 2.5 },
                { freq: fundamental * 4.5, gain: 0.15, decay: 1.8 },
                { freq: fundamental * 5.4, gain: 0.1, decay: 1.2 },
                { freq: fundamental * 6.8, gain: 0.08, decay: 0.8 } // High-frequency strike brilliance
            ];

            let masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.linearRampToValueAtTime(0.5, now + 0.008); // Ultra fast attack strike
            masterGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0); // 6-second resonant ring decay!

            partials.forEach(p => {
                let osc = audioCtx.createOscillator();
                let pGain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(p.freq, now);

                // Add extremely subtle frequency vibrato/beating for natural metallic warmth
                let vibrato = audioCtx.createOscillator();
                let vibratoGain = audioCtx.createGain();
                vibrato.frequency.value = 1.8 + Math.random() * 0.8; // 2Hz beating
                vibratoGain.gain.value = 0.5 + Math.random() * 0.5; // slight detune amount
                vibrato.connect(vibratoGain);
                vibratoGain.connect(osc.frequency);
                vibrato.start(now);
                vibrato.stop(now + p.decay);

                pGain.gain.setValueAtTime(p.gain, now);
                pGain.gain.exponentialRampToValueAtTime(0.001, now + p.decay);

                osc.connect(pGain);
                pGain.connect(masterGain);

                osc.start(now);
                osc.stop(now + p.decay);
            });

            // Add stereo space panning (Bell is on the right side of the screen)
            if (audioCtx.createStereoPanner) {
                let panner = audioCtx.createStereoPanner();
                panner.pan.value = 0.45; 
                masterGain.connect(panner);
                panner.connect(audioCtx.destination);
            } else {
                masterGain.connect(audioCtx.destination);
            }

        } catch (e) {
            console.error("Synthesizer error:", e);
        }
    }

    function triggerBellStrike() {
        playBellSound();
        bellSwingVelocity += 0.45 * (Math.random() > 0.5 ? 1 : -1); // natural physical impulse, avoiding wild helicopter spin
        bellRippleActive = true;
        bellRippleProgress = 0;
        bellRippleIntensity = 1.0;
    }

    function drawAdditionalShrines(time) {
        let horizonY = centerY + 410 * scale;
        let geyaWidth = 720 * scale;
        let boardLeft = centerX - geyaWidth / 2;
        let boardRight = centerX + geyaWidth / 2;

        ctx.save();

        // 1. Draw Dharma Chakra (ධර්ම චක්‍රය - වම - Left Base)
        // Placed near the left corner of the name board (leaving an elegant gap from the edge)
        let dcX = centerX - 295 * scale;
        let dcY = centerY + 329 * scale;
        let dcRadius = 30 * scale;

        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd700';
        ctx.lineWidth = 3.5 * scale;
        ctx.strokeStyle = '#ffd700'; // Gold
        ctx.fillStyle = '#ffbb00';

        // Outer Wheel Rim
        ctx.beginPath();
        ctx.arc(dcX, dcY, dcRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(dcX, dcY, dcRadius * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        // Hub (Center)
        ctx.beginPath();
        ctx.arc(dcX, dcY, dcRadius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 8 Spokes (Dharmachakra spokes)
        for (let i = 0; i < 8; i++) {
            let angle = (i * Math.PI) / 4 + time * 0.005; // slowly rotates for a premium effect!
            let startR = dcRadius * 0.2;
            let endR = dcRadius * 0.75;

            ctx.beginPath();
            ctx.moveTo(dcX + Math.cos(angle) * startR, dcY + Math.sin(angle) * startR);
            ctx.lineTo(dcX + Math.cos(angle) * endR, dcY + Math.sin(angle) * endR);
            ctx.stroke();
        }

        // Add animated lighting bulbs on the Chakra Rim
        ctx.globalCompositeOperation = 'lighter';
        let numDcBulbs = 8;
        let colors = ['blue', 'yellow', 'red', 'white', 'orange'];
        for (let i = 0; i < numDcBulbs; i++) {
            let angle = (i * Math.PI * 2) / numDcBulbs + time * 0.005;
            let bx = dcX + Math.cos(angle) * dcRadius;
            let by = dcY + Math.sin(angle) * dcRadius;
            let color = colors[(i + Math.floor(time * 0.05)) % colors.length];
            let cache = bulbCaches[color] || bulbCaches['yellow'];
            if (cache) {
                let onImg = (Math.floor(time * 0.1) + i) % 2 === 0 ? cache.on : cache.off;
                ctx.drawImage(onImg, bx - bulbCacheOffset, by - bulbCacheOffset);
            }
        }
        ctx.restore();

        // 2. Draw Waving Buddhist Flag (බෞද්ධ කොඩිය - දකුණ - Right Base)
        // Placed near the right corner of the name board (leaving an elegant gap from the edge)
        let flagX = centerX + 269 * scale;
        let flagY = centerY + 300 * scale;
        let flagWidth = 50 * scale;
        let flagHeight = 35 * scale;

        ctx.save();
        // Dynamic waving effect using sine wave (no flagpole as requested!)
        ctx.translate(flagX, flagY + 4 * scale);
        let flagColors = ['#0000ff', '#ffff00', '#ff0000', '#ffffff', '#ff8800'];
        let stripeW = flagWidth / 6;

        for (let col = 0; col < 5; col++) {
            ctx.fillStyle = flagColors[col];
            ctx.beginPath();
            for (let y = 0; y <= flagHeight; y += 2) {
                let waveX = Math.sin(time * 0.08 + y * 0.05) * 3 * scale;
                let startX = col * stripeW + waveX;
                let endX = (col + 1) * stripeW + waveX;
                ctx.fillRect(startX, y, endX - startX, 2.5);
            }
        }

        // 6th combined horizontal stripes stripe
        let lastCol = 5;
        let hStripeH = flagHeight / 5;
        for (let row = 0; row < 5; row++) {
            ctx.fillStyle = flagColors[row];
            ctx.beginPath();
            for (let y = row * hStripeH; y <= (row + 1) * hStripeH; y += 2) {
                let waveX = Math.sin(time * 0.08 + y * 0.05) * 3 * scale;
                let startX = lastCol * stripeW + waveX;
                let endX = (lastCol + 1) * stripeW + waveX;
                ctx.fillRect(startX, y, endX - startX, 2.5);
            }
        }
        ctx.restore();

        // 3. Draw Stupa / Chaitya (චෛත්‍යය - වම - Far Left Shore)
        // Sitting proudly on the far-left horizon, larger and clear of any panels!
        let stupaX = centerX - 640 * scale;
        let stupaY = horizonY;
        let stupaScale = 1.5 * scale;

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255,255,255,0.25)';

        // 3a. Peshawalalu (Base Rings)
        ctx.fillStyle = isDayTime ? '#f5f5f5' : '#d8e1f0';
        ctx.beginPath();
        ctx.ellipse(stupaX, stupaY - 5 * stupaScale, 45 * stupaScale, 8 * stupaScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.ellipse(stupaX, stupaY - 12 * stupaScale, 41 * stupaScale, 7 * stupaScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.ellipse(stupaX, stupaY - 18 * stupaScale, 37 * stupaScale, 6 * stupaScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3b. Gharbhaya (Dome)
        // Soft radial gradient for a premium 3D sphere look
        let domeGrad = ctx.createRadialGradient(stupaX - 10 * stupaScale, stupaY - 45 * stupaScale, 5 * stupaScale, stupaX, stupaY - 35 * stupaScale, 35 * stupaScale);
        domeGrad.addColorStop(0, '#ffffff');
        domeGrad.addColorStop(0.7, isDayTime ? '#ededed' : '#c3cedf');
        domeGrad.addColorStop(1, isDayTime ? '#c8c8c8' : '#93a4be');
        ctx.fillStyle = domeGrad;

        ctx.beginPath();
        ctx.arc(stupaX, stupaY - 18 * stupaScale, 32 * stupaScale, Math.PI, 0);
        ctx.fill();

        // 3c. Hathares Kotuva (Square Chamber)
        ctx.fillStyle = isDayTime ? '#e5e5e5' : '#b2c1d6';
        ctx.fillRect(stupaX - 10 * stupaScale, stupaY - 58 * stupaScale, 20 * stupaScale, 8 * stupaScale);

        // 3d. Devatha Kotuva & Kot Kaeralla (Spire)
        ctx.fillStyle = '#ffd700'; // Gold spire
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5 * stupaScale;

        // Devatha kotuva cylinder
        ctx.beginPath();
        ctx.ellipse(stupaX, stupaY - 60 * stupaScale, 6 * stupaScale, 2 * stupaScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rings of spire tapering up
        for (let i = 0; i < 9; i++) {
            let ry = stupaY - (62 + i * 3) * stupaScale;
            let rw = (6 - i * 0.5) * stupaScale;
            ctx.beginPath();
            ctx.ellipse(stupaX, ry, rw, 1 * stupaScale, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Kotha (Pinnacle)
        let kothaY = stupaY - 92 * stupaScale;
        ctx.beginPath();
        ctx.moveTo(stupaX, kothaY);
        ctx.lineTo(stupaX - 2.5 * stupaScale, kothaY + 5 * stupaScale);
        ctx.lineTo(stupaX + 2.5 * stupaScale, kothaY + 5 * stupaScale);
        ctx.closePath();
        ctx.fill();

        // Glowing crystal gem on pinnacle
        ctx.fillStyle = '#ff3300';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3300';
        ctx.beginPath();
        ctx.arc(stupaX, kothaY - 1 * stupaScale, 2 * stupaScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Draw Bell Tower (ඝන්ටාර කුලුන - දකුණ - Far Right Shore)
        // Sitting proudly on the far-right horizon, larger and clear of any panels!
        let towerX = centerX + 640 * scale;
        let towerY = horizonY;
        let towerScale = 1.5 * scale;

        ctx.save();
        // Pillars (Brown Columns)
        ctx.fillStyle = isDayTime ? '#4e2d14' : '#140c05';
        ctx.fillRect(towerX - 22 * towerScale, towerY - 80 * towerScale, 5 * towerScale, 80 * towerScale);
        ctx.fillRect(towerX + 17 * towerScale, towerY - 80 * towerScale, 5 * towerScale, 80 * towerScale);

        // Roof (Pagoda shape)
        ctx.fillStyle = isDayTime ? '#7d3821' : '#210d06';
        ctx.beginPath();
        ctx.moveTo(towerX - 35 * towerScale, towerY - 80 * towerScale);
        ctx.quadraticCurveTo(towerX, towerY - 95 * towerScale, towerX + 35 * towerScale, towerY - 80 * towerScale);
        ctx.lineTo(towerX + 25 * towerScale, towerY - 90 * towerScale);
        ctx.quadraticCurveTo(towerX, towerY - 105 * towerScale, towerX - 25 * towerScale, towerY - 90 * towerScale);
        ctx.closePath();
        ctx.fill();

        // Spire on Roof
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(towerX, towerY - 110 * towerScale);
        ctx.lineTo(towerX - 3 * towerScale, towerY - 95 * towerScale);
        ctx.lineTo(towerX + 3 * towerScale, towerY - 95 * towerScale);
        ctx.closePath();
        ctx.fill();

        // Physics-based bell swing with deceleration dampening
        let targetSwing = Math.sin(time * 0.04) * 0.45;
        let acceleration = (targetSwing - bellSwingAngle) * 0.08;
        bellSwingVelocity += acceleration;
        bellSwingVelocity *= 0.95; // physics dampening
        bellSwingAngle += bellSwingVelocity;

        // Limit the maximum swing angle to a realistic bell sway range (max 50 degrees / 0.85 radians)
        // This stops it from spinning wildly like a helicopter prop and jumping "up and down"
        if (bellSwingAngle > 0.85) {
            bellSwingAngle = 0.85;
            bellSwingVelocity = -Math.abs(bellSwingVelocity) * 0.4; // gentle spring bounce
        } else if (bellSwingAngle < -0.85) {
            bellSwingAngle = -0.85;
            bellSwingVelocity = Math.abs(bellSwingVelocity) * 0.4; // gentle spring bounce
        }

        ctx.save();
        ctx.translate(towerX, towerY - 72 * towerScale);
        ctx.rotate(bellSwingAngle);

        // Detect Bell Strike (Strike sound & light ripple played at swing peak)
        let currentTime = Date.now();
        if (Math.abs(bellSwingAngle) > 0.42 && (currentTime - lastBellStrikeTime > 2200)) {
            lastBellStrikeTime = currentTime;
            // Strike bell!
            triggerBellStrike();
        }

        // Draw Hanger string
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2 * towerScale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 10 * towerScale);
        ctx.stroke();

        // Draw Golden Bell Body
        ctx.fillStyle = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255,215,0,0.5)';

        ctx.beginPath();
        // Top crown of bell
        ctx.arc(0, 12 * towerScale, 6 * towerScale, Math.PI, 0);
        // Flared bell body
        ctx.lineTo(10 * towerScale, 28 * towerScale);
        ctx.quadraticCurveTo(0, 31 * towerScale, -10 * towerScale, 28 * towerScale);
        ctx.closePath();
        ctx.fill();

        // Bell Clapper (striker inside)
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(Math.sin(bellSwingAngle * 2) * 3 * towerScale, 29 * towerScale, 3 * towerScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }

    function drawLake(time) {
        let horizonY = centerY + 410 * scale; // Set horizon just below the text/base
        let lakeHeight = height - horizonY;
        if (lakeHeight <= 0) return; // Screen not tall enough for lake

        ctx.save();

        // 1. Draw deep water background with a richer navy blue to clearly define the pond
        ctx.fillStyle = '#020f26';
        ctx.fillRect(0, horizonY, width, lakeHeight);

        // Ambient horizon water glow all along the shoreline
        let horizonGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + 60 * scale);
        horizonGrad.addColorStop(0, 'rgba(58, 107, 156, 0.35)');
        horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, horizonY, width, 60 * scale);

        // Draw a beautiful shoreline separating the land/mountains and the pond
        ctx.strokeStyle = isDayTime ? '#1a1008' : '#0a1a30';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(width, horizonY);
        ctx.stroke();

        // Subtle water-line highlight just below the shore
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1 * scale;
        ctx.beginPath();
        ctx.moveTo(0, horizonY + 2 * scale);
        ctx.lineTo(width, horizonY + 2 * scale);
        ctx.stroke();

        // 2. Draw Stylized Watercolor Reflection (No Canvas Self-Draw Stall!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        let colors = activeColorSequence;
        let leftColorDef = COLORS[colors[0] || 'blue'];
        let centerColorDef = COLORS[colors[1] || 'yellow'];
        let rightColorDef = COLORS[colors[2] || 'red'];

        let pulse = 0.15 + (currentAudioEnergy * 0.2) + Math.sin(time * 0.03) * 0.05;

        // Center Reflection (Golden/Yellow Buddha & Halo glow)
        let gradCenter = ctx.createRadialGradient(centerX, horizonY, 0, centerX, horizonY, 300 * scale);
        gradCenter.addColorStop(0, `rgba(255, 215, 0, ${pulse * 0.8})`);
        gradCenter.addColorStop(0.5, `rgba(255, 140, 0, ${pulse * 0.3})`);
        gradCenter.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradCenter;
        ctx.beginPath();
        ctx.ellipse(centerX, horizonY + lakeHeight * 0.4, 400 * scale, lakeHeight * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left Reflection
        let gradLeft = ctx.createRadialGradient(centerX - 350 * scale, horizonY, 0, centerX - 350 * scale, horizonY, 200 * scale);
        let leftOn = leftColorDef.glow || '#0088ff';
        gradLeft.addColorStop(0, leftOn + Math.floor(pulse * 255 * 0.6).toString(16).padStart(2, '0'));
        gradLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradLeft;
        ctx.beginPath();
        ctx.ellipse(centerX - 350 * scale, horizonY + lakeHeight * 0.4, 250 * scale, lakeHeight * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Right Reflection
        let gradRight = ctx.createRadialGradient(centerX + 350 * scale, horizonY, 0, centerX + 350 * scale, horizonY, 200 * scale);
        let rightOn = rightColorDef.glow || '#ff3333';
        gradRight.addColorStop(0, rightOn + Math.floor(pulse * 255 * 0.6).toString(16).padStart(2, '0'));
        gradRight.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradRight;
        ctx.beginPath();
        ctx.ellipse(centerX + 350 * scale, horizonY + lakeHeight * 0.4, 250 * scale, lakeHeight * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 3. Add a subtle dark gradient over the water to fade it out at the bottom BEFORE drawing foreground items!
        // This keeps swans, fishes, ripples, and offered items bright and crystal-clear!
        let gradient = ctx.createLinearGradient(0, horizonY, 0, height);
        gradient.addColorStop(0, 'rgba(1, 5, 18, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, horizonY, width, lakeHeight);

        // 4. Draw Ripples & Water Wave Reflections
        drawRipples();

        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#3a6b9c'; // Water ripple color
        ctx.lineWidth = 1.0;

        let numRipples = performanceMode ? 2 : (isMobile ? 4 : 8); // fewer ripples in performance mode!
        for (let i = 0; i < numRipples; i++) {
            let y = horizonY + (lakeHeight / numRipples) * i + (Math.sin(time * 0.02 + i) * 3);
            ctx.beginPath();
            let rStart = 0;
            let rEnd = width;
            let spacing = Math.max(5, performanceMode ? 60 * scale : (isMobile ? 40 * scale : 20 * scale));
            for (let x = rStart; x <= rEnd; x += spacing) {
                let yOffset = Math.sin(((x - rStart) * 0.012) + (time * 0.03) + i) * (1.5 + i * 0.4);
                if (x === rStart) ctx.moveTo(x, y + yOffset);
                else ctx.lineTo(x, y + yOffset);
            }
            ctx.stroke();
        }
        ctx.restore();

        // 5. Draw Interactive Submerged Koi Fishes (Beautifully below surface lotuses!)
        drawKoiFishes(time, horizonY, lakeHeight);

        // 6. Draw floating lotuses on the lake (fully distributed across the screen width!)
        drawFloatingLotus(centerX - 330 * scale, horizonY + 30 * scale, 0.5 * scale, time);
        drawFloatingLotus(centerX + 330 * scale, horizonY + 45 * scale, 0.65 * scale, time);
        drawFloatingLotus(centerX - 150 * scale, horizonY + 80 * scale, 0.8 * scale, time);
        drawFloatingLotus(centerX + 180 * scale, horizonY + 110 * scale, 1.1 * scale, time);
        drawFloatingLotus(centerX - 260 * scale, horizonY + 130 * scale, 1.3 * scale, time);

        drawFloatingLotus(width * 0.12, horizonY + 25 * scale, 0.55 * scale, time);
        drawFloatingLotus(width * 0.22, horizonY + 60 * scale, 0.7 * scale, time);
        drawFloatingLotus(width * 0.78, horizonY + 70 * scale, 0.75 * scale, time);
        drawFloatingLotus(width * 0.88, horizonY + 35 * scale, 0.6 * scale, time);

        // 7. Draw Swans (හංසයෝ) - High clarity 3D styled, sitting on the lake surface
        ctx.save();
        let swan1X = centerX - 120 * scale + Math.sin(time * 0.02) * 45 * scale;
        let swan1Y = horizonY + lakeHeight * 0.45;

        let swan2X = centerX + 120 * scale + Math.sin(time * 0.02 + 1.5) * 45 * scale;
        let swan2Y = horizonY + lakeHeight * 0.5;

        let drawSwan = (sx, sy, isFlipped) => {
            ctx.save();
            ctx.translate(sx, sy);
            if (isFlipped) ctx.scale(-1, 1);

            // Shading gradient for 3D body depth
            let bodyGrad = ctx.createLinearGradient(0, -8 * scale, 0, 8 * scale);
            bodyGrad.addColorStop(0, '#ffffff');
            bodyGrad.addColorStop(0.7, '#f4f7fa');
            bodyGrad.addColorStop(1, '#c8d4e0');

            ctx.fillStyle = bodyGrad;
            ctx.shadowBlur = 12 * scale;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';

            // Body
            ctx.beginPath();
            ctx.ellipse(0, 0, 18 * scale, 9 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wing line detail
            ctx.strokeStyle = 'rgba(180, 195, 210, 0.6)';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.ellipse(-2 * scale, -1 * scale, 11 * scale, 6 * scale, 0.1, 0, Math.PI * 2);
            ctx.stroke();

            // Neck & Head
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-12 * scale, -2 * scale);
            ctx.quadraticCurveTo(-22 * scale, -18 * scale, -14 * scale, -26 * scale);
            ctx.quadraticCurveTo(-9 * scale, -29 * scale, -8 * scale, -25 * scale);
            ctx.quadraticCurveTo(-12 * scale, -17 * scale, -6 * scale, -2 * scale);
            ctx.fill();

            // Beak (Vibrant Orange)
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(-14 * scale, -26 * scale);
            ctx.lineTo(-21 * scale, -23 * scale);
            ctx.lineTo(-12 * scale, -21 * scale);
            ctx.closePath();
            ctx.fill();

            // Eye (High contrast black dot)
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-12 * scale, -25 * scale, 1.2 * scale, 0, Math.PI * 2);
            ctx.fill();

            // Tail feathers
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(12 * scale, -3 * scale);
            ctx.lineTo(21 * scale, -12 * scale);
            ctx.lineTo(15 * scale, 4 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        drawSwan(swan1X, swan1Y, false);
        drawSwan(swan2X, swan2Y, true); // Face each other
        ctx.restore();

        // 8. Draw Offered Lamps & Lotuses on the very top layer
        drawOfferedLamps(time);
        drawOfferedLotuses(time);

        ctx.restore();
    }

    function addRipple(x, y) {
        waterRipples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 40 * scale + Math.random() * 20 * scale,
            alpha: 1
        });
    }

    function drawRipples() {
        ctx.save();
        for (let i = waterRipples.length - 1; i >= 0; i--) {
            let r = waterRipples[i];
            r.radius += 1 * scale;
            r.alpha -= 0.02;

            if (r.alpha <= 0) {
                waterRipples.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            // Ripples in perspective (ellipse)
            ctx.ellipse(r.x, r.y, r.radius * 2, r.radius, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(150, 200, 255, ${r.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawKoiFishes(time, horizonY, lakeHeight) {
        ctx.save();
        // Set soft watery opacity so the dark water background is visible through them
        ctx.globalAlpha = 0.6;

        koiFishes.forEach(fish => {
            let minY = horizonY + 20 * scale;
            if (fish.y < minY) fish.y = minY + Math.random() * 50 * scale;

            if (fish.targetX && fish.targetY) {
                let dx = fish.targetX - fish.x;
                let dy = fish.targetY - fish.y;
                let dist = Math.hypot(dx, dy);
                if (dist < 10 * scale) {
                    fish.targetX = null; fish.targetY = null;
                } else {
                    let targetAngle = Math.atan2(dy, dx);
                    let diff = targetAngle - fish.angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    fish.angle += diff * 0.08; // Turn speed
                    fish.speed = 2.5 * scale; // swim faster to target
                }
            } else {
                fish.speed = 0.5 * scale; // normal speed
                if (Math.random() < 0.02) {
                    fish.angle += (Math.random() - 0.5) * Math.PI / 2;
                }
            }

            fish.x += Math.cos(fish.angle) * fish.speed;
            fish.y += Math.sin(fish.angle) * fish.speed;

            // Keep in bounds
            if (fish.x < 0) { fish.x = 0; fish.angle = Math.PI - fish.angle; }
            if (fish.x > width) { fish.x = width; fish.angle = Math.PI - fish.angle; }
            if (fish.y < minY) { fish.y = minY; fish.angle = -fish.angle; }
            if (fish.y > height) { fish.y = height; fish.angle = -fish.angle; }

            // Draw fish
            ctx.save();
            ctx.translate(fish.x, fish.y);
            ctx.rotate(fish.angle);

            // Water refraction wave effect (warp the body slightly using a sine wave transformation!)
            let warp = Math.sin(time * 0.05 + fish.x * 0.02) * 0.12;
            ctx.transform(1, warp, 0, 1, 0, 0);

            let swimWobble = Math.sin(time * 0.1 * (fish.speed / scale) + fish.wobbleOffset);

            // Submerged deep shadow
            ctx.fillStyle = 'rgba(1, 8, 25, 0.7)';
            ctx.beginPath();
            ctx.ellipse(-3 * scale, 8 * scale, 13 * scale, 5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Glowing cyan shadow representing underwater caustics light transmission
            ctx.shadowBlur = 12 * scale;
            ctx.shadowColor = '#00ffff';

            // Body
            ctx.fillStyle = fish.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 15 * scale, 6 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(-10 * scale, 0);
            ctx.lineTo(-22 * scale, (swimWobble * 6) * scale);
            ctx.lineTo(-22 * scale, (-swimWobble * 6) * scale);
            ctx.fill();

            // Head white spot (Koi pattern)
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath();
            ctx.ellipse(6 * scale, 0, 5 * scale, 3 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Shimmering translucent blue-cyan water tint overlay to blend it SUBMERGED!
            ctx.fillStyle = 'rgba(0, 180, 255, 0.35)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 15.5 * scale, 6.5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.arc(10 * scale, -3 * scale, 1.5 * scale, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(10 * scale, 3 * scale, 1.5 * scale, 0, Math.PI * 2); ctx.fill();

            ctx.restore();
        });
        ctx.restore();
    }

    function drawFloatingLotus(cx, cy, scaleFactor, time) {
        if (!lotusCacheCanvas) return;
        ctx.save();
        ctx.translate(cx, cy);

        let yOffset = Math.sin(time * 0.03 + cx) * 4;
        ctx.translate(0, yOffset);
        ctx.scale(scaleFactor, scaleFactor);

        let w = lotusCacheCanvas.width;
        let h = lotusCacheCanvas.height;
        ctx.drawImage(lotusCacheCanvas, -w / 2, -h / 2);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 8, 30 + Math.sin(time * 0.05) * 4, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    function drawBoTree(time) {
        if (!treeCacheCanvas) return;

        ctx.save();

        // Wind sway: apply skew to the pre-rendered tree offscreen canvas
        let windSkew = Math.sin(time * 0.012) * 0.012;
        ctx.transform(1, 0, windSkew, 1, 0, 0);

        ctx.drawImage(treeCacheCanvas, 0, 0);

        ctx.restore();

        // Hang swinging lanterns
        if (branchTips.length >= 4) {
            let numLanterns = isMobile ? 3 : 5;
            for (let i = 0; i < numLanterns; i++) {
                let tIndex = Math.floor(branchTips.length * (i + 0.5) / numLanterns);
                let tip = branchTips[tIndex];
                if (tip) {
                    let tipX = tip.x + windSkew * tip.y;
                    let tipY = tip.y;

                    let size = 0.45 + (i % 2) * 0.08;
                    let stringLen = (40 + (i % 3) * 20) * scale;

                    drawVesakLantern(time, tipX, tipY, size, i * 150, stringLen);
                }
            }
        }
    }

    function drawVesakLantern(time, lx, ly, sizeScale, timeOffset, stringLength) {
        let wind = Math.sin(time / 400 + timeOffset) * 0.15 + 0.1; // Gentler wind
        let swing = Math.sin(time / 500 + timeOffset) * 0.08 + wind * 0.3; // Elegant swing

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(swing);

        // Draw string connecting to branch
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, stringLength);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();

        let s = 45 * scale * sizeScale; // Scaled lantern

        ctx.translate(0, stringLength + s);

        // Atapattam drawing (Solid polygon instead of wireframe)
        // Back panels (darker)
        ctx.fillStyle = 'rgba(200, 100, 0, 0.8)';
        ctx.beginPath();
        ctx.moveTo(-s * 0.5, -s); ctx.lineTo(s * 0.5, -s);
        ctx.lineTo(s, 0); ctx.lineTo(s * 0.5, s);
        ctx.lineTo(-s * 0.5, s); ctx.lineTo(-s, 0);
        ctx.fill();

        // Inner glowing light (flickering candle)
        ctx.globalCompositeOperation = 'lighter';
        let glow = Math.abs(Math.sin(time / 50)) * 0.3 + 0.7;
        let radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2);
        radGrad.addColorStop(0, `rgba(255, 220, 100, ${glow})`);
        radGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath(); ctx.arc(0, 0, s * 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Front panels (brighter paper)
        ctx.shadowBlur = 15 * scale;
        ctx.shadowColor = 'rgba(255, 150, 0, 0.8)';
        ctx.fillStyle = 'rgba(255, 240, 150, 0.9)';
        ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.8); ctx.lineTo(s * 0.4, -s * 0.8); ctx.lineTo(s * 0.8, 0); ctx.lineTo(s * 0.4, s * 0.8); ctx.lineTo(-s * 0.4, s * 0.8); ctx.lineTo(-s * 0.8, 0); ctx.fill();

        // Highlight center panel
        ctx.fillStyle = 'rgba(255, 250, 200, 0.95)';
        ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.6); ctx.lineTo(s * 0.3, -s * 0.6); ctx.lineTo(s * 0.6, 0); ctx.lineTo(s * 0.3, s * 0.6); ctx.lineTo(-s * 0.3, s * 0.6); ctx.lineTo(-s * 0.6, 0); ctx.fill();

        // Bamboo Frame lines (thick)
        ctx.strokeStyle = '#220a00'; // dark bamboo
        ctx.lineWidth = 2.5 * scale;
        // Outer Hexagon
        ctx.beginPath(); ctx.moveTo(-s * 0.5, -s); ctx.lineTo(s * 0.5, -s); ctx.lineTo(s, 0); ctx.lineTo(s * 0.5, s); ctx.lineTo(-s * 0.5, s); ctx.lineTo(-s, 0); ctx.closePath(); ctx.stroke();
        // Inner Hexagon
        ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.8); ctx.lineTo(s * 0.4, -s * 0.8); ctx.lineTo(s * 0.8, 0); ctx.lineTo(s * 0.4, s * 0.8); ctx.lineTo(-s * 0.4, s * 0.8); ctx.lineTo(-s * 0.8, 0); ctx.closePath(); ctx.stroke();
        // Cross lines
        ctx.beginPath(); ctx.moveTo(-s * 0.5, -s); ctx.lineTo(-s * 0.4, -s * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * 0.5, -s); ctx.lineTo(s * 0.4, -s * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(s * 0.8, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * 0.5, s); ctx.lineTo(s * 0.4, s * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s * 0.5, s); ctx.lineTo(-s * 0.4, s * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(-s * 0.8, 0); ctx.stroke();

        // Frills (Rali) - dense and flowy paper strips hanging only from the bottom edge!
        let numFrills = 8;
        let frillLen = 120 * scale;

        for (let i = 0; i < numFrills; i++) {
            let fx = -s * 0.5 + (s / (numFrills - 1)) * i;
            let fy = s; // bottom edge

            ctx.beginPath();
            ctx.moveTo(fx, fy);

            // Fix Animation Physics: The context is already rotated by 'swing'. 
            // So we just add a soft trailing drag (opposite to swing) and a flutter wave!
            let drag = -swing * 60 * scale; // Less extreme drag
            let wave = Math.sin(time / 40 + i * 0.5) * 5 * scale; // Slower, softer paper flutter

            ctx.quadraticCurveTo(fx + drag * 0.5, fy + frillLen * 0.5, fx + drag + wave, fy + frillLen);

            // Draw paper strips
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + (i % 2) * 0.2})`;
            ctx.lineWidth = 3 * scale;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawStoryImages() {
        storyPanels.forEach(p => {
            let innerRadius = p.radius * 0.95; // Increased to make image take more space

            // 1. Clipping Mask and Image
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, innerRadius, 0, Math.PI * 2);
            ctx.clip();

            if (p.image && p.image.complete && p.image.naturalWidth > 0) {
                // Draw image scaled to cover the circle
                let scale = Math.max(innerRadius * 2 / p.image.width, innerRadius * 2 / p.image.height);
                let w = p.image.width * scale;
                let h = p.image.height * scale;

                let drawX = p.x - w / 2;
                let drawY = p.y - h / 2; // Default vertical center

                // If the image is taller than the circle, align it closer to the top to avoid cutting off heads
                if (h > innerRadius * 2) {
                    drawY = p.y - innerRadius - (h - innerRadius * 2) * 0.15; // 15% from the top
                }

                ctx.drawImage(p.image, drawX, drawY, w, h);
            } else {
                // Fallback background if image is loading or missing
                ctx.fillStyle = '#111';
                ctx.fill();
            }
            ctx.restore();

            // 2. Light Border around the image
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, innerRadius, 0, Math.PI * 2);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FFD700'; // Gold border
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FF8C00'; // Orange glow
            ctx.stroke();

            // Inner thin bright border
            ctx.beginPath();
            ctx.arc(p.x, p.y, innerRadius, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FFFFFF';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#FFFFFF';
            ctx.stroke();
            ctx.restore();
        });
    }

    function drawAudioAura(time) {
        if (!isLightsOn) return;

        let numBars = performanceMode ? 32 : 64;
        let haloCenterX = centerX;
        let haloCenterY = centerY - 120 * scale;
        let innerRadius = 175 * scale;
        
        ctx.save();
        if (!performanceMode) {
            ctx.shadowBlur = 10 * scale;
        }
        ctx.lineWidth = performanceMode ? 1.5 * scale : 2.5 * scale;
        ctx.lineCap = 'round';

        let colorKeys = ['#0088ff', '#ffaa00', '#ff3333', '#ffffff', '#ff6600'];

        for (let i = 0; i < numBars; i++) {
            let angle = (i / numBars) * Math.PI * 2 + time * 0.005; // slowly rotate the aura!
            let color = colorKeys[Math.floor((i / numBars) * colorKeys.length) % colorKeys.length];
            
            ctx.strokeStyle = color;
            if (!performanceMode) {
                ctx.shadowColor = color;
            }

            // Procedural wave heights
            let waveFreq1 = Math.sin(i * 0.3 + time * 0.08) * 0.3;
            let waveFreq2 = Math.sin(i * 0.15 - time * 0.03) * 0.2;
            let multiplier = 0.5 + waveFreq1 + waveFreq2;
            
            let baseLength = 4 * scale;
            let reactiveLength = currentAudioEnergy * 45 * scale * Math.max(0.2, multiplier);
            let barLength = baseLength + reactiveLength;

            let cos = Math.cos(angle);
            let sin = Math.sin(angle);

            let startX = haloCenterX + cos * innerRadius;
            let startY = haloCenterY + sin * innerRadius;
            let endX = haloCenterX + cos * (innerRadius + barLength);
            let endY = haloCenterY + sin * (innerRadius + barLength);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawBuddhaPlaceholder() {
        if (!buddhaImg.complete || buddhaImg.naturalWidth === 0) return;

        // Correctly scale the tightly-cropped PNG image.
        // The distance from the halo center (centerY - 120) to the base (centerY + 200) is 320*scale.
        // We make the image slightly larger (380*scale) so the head sits inside the halo and the seat sinks slightly into the base to prevent floating.
        let h = 470 * scale;
        let imgScale = h / buddhaImg.height;
        let w = buddhaImg.width * imgScale;

        let drawX = centerX - w / 2;

        // Place the top of the image slightly above the halo center so the head aligns perfectly
        let drawY = (centerY - 120 * scale) - 50 * scale;

        ctx.save();
        // Add a soft majestic glow behind the Buddha
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.6)'; // Golden glow

        ctx.drawImage(buddhaImg, drawX, drawY, w, h);
        ctx.restore();
    }

    function drawAmbientParticles(time) {
        // Keep a constant number of particles
        while (ambientParticles.length < 80) {
            let isPetal = Math.random() > 0.4; // 60% petals, 40% sparks
            ambientParticles.push({
                type: isPetal ? 'petal' : 'spark',
                x: centerX + (Math.random() - 0.5) * (width * 0.9), // Spread across the pandal
                y: isPetal ? -50 - Math.random() * 100 : height + 50 + Math.random() * 100, // Petals start top, sparks start bottom
                speedY: isPetal ? (1 + Math.random() * 1.5) * scale : -(0.5 + Math.random() * 1.5) * scale,
                speedX: (Math.random() - 0.5) * 0.5 * scale,
                size: isPetal ? (6 + Math.random() * 8) * scale : (1.5 + Math.random() * 2.5) * scale,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.05,
                alpha: 0,
                targetAlpha: isPetal ? 0.75 + Math.random() * 0.25 : 0.6 + Math.random() * 0.4,
                wobbleSpeed: 0.015 + Math.random() * 0.02,
                wobblePhase: Math.random() * Math.PI * 2
            });
        }

        ctx.save();
        for (let i = ambientParticles.length - 1; i >= 0; i--) {
            let p = ambientParticles[i];

            // Movement
            p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.wobblePhase) * 0.5 * scale;
            p.y += p.speedY;
            p.angle += p.spin;

            // Fade in/out logic
            if (p.type === 'petal') {
                if (p.y < height * 0.1) p.alpha = Math.min(p.targetAlpha, p.alpha + 0.015);
                if (p.y > height - 100) p.alpha -= 0.015;
            } else {
                if (p.y > height * 0.8) p.alpha = Math.min(p.targetAlpha, p.alpha + 0.015);
                if (p.y < 150) p.alpha -= 0.015;
            }

            // Remove dead particles
            if (p.alpha <= 0 && (p.y > height || p.y < 0)) {
                ambientParticles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = Math.max(0, p.alpha);

            if (p.type === 'petal') {
                // Draw falling petal
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                // Add a very slight glow to the petals so they look magical
                ctx.shadowBlur = 5 * scale;
                ctx.shadowColor = 'rgba(255, 182, 193, 0.5)';

                ctx.fillStyle = '#ffb6c1'; // Light pink
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                // Draw a beautiful petal shape using bezier curves
                ctx.bezierCurveTo(p.size, -p.size * 0.2, p.size * 0.5, p.size, 0, p.size);
                ctx.bezierCurveTo(-p.size * 0.5, p.size, -p.size, -p.size * 0.2, 0, -p.size);
                ctx.fill();
                ctx.restore();
            } else {
                // Draw glowing spark using cache!
                if (sparkCacheCanvas) {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.globalCompositeOperation = 'lighter';
                    let w = sparkCacheCanvas.width * (p.size / 2.5);
                    let h = sparkCacheCanvas.height * (p.size / 2.5);
                    ctx.drawImage(sparkCacheCanvas, -w / 2, -h / 2, w, h);
                    ctx.restore();
                }
            }
        }
        ctx.restore();
    }

    function drawBulb(b, t) {
        let state = getBulbState(b, t);

        // For text, use the specialized sharp cache to prevent excessive bloom
        if (b.group.startsWith('base-text')) {
            let tCacheObj = textBulbCaches[b.color] || textBulbCaches['white'];
            if (!tCacheObj) return;
            let img = state > 0.5 ? tCacheObj.on : tCacheObj.off;

            ctx.save();
            // Crucial: Override 'lighter' blending to normal 'source-over' so the black shadow works and prevents ALL bloom!
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = state > 0.5 ? 1.0 : 0.4;
            ctx.drawImage(img, b.x - tCacheObj.offset, b.y - tCacheObj.offset);
            ctx.restore();
            return;
        }

        let activeColor = b.color;

        // AudioSync dynamic color override!
        if (currentPattern === 'audioSync' && currentAudioEnergy > 0.1) {
            if (currentAudioEnergy > 0.6) {
                const intense = ['white', 'red', 'yellow', 'cyan', 'magenta'];
                let hash = Math.floor((b.index * 13 + t) / 5) % intense.length;
                activeColor = intense[hash];
            } else {
                const cool = ['blue', 'cyan', 'green', 'purple'];
                let wave = Math.floor((distToCenter(b.x, b.y) - t * 10) / 50) % cool.length;
                if (wave < 0) wave += cool.length;
                activeColor = cool[wave];
            }
        }

        // Bell golden-white circular light ripple wave overlay!
        if (bellRippleActive && bellRippleIntensity > 0.05) {
            let bellTowerX = centerX + 640 * scale;
            let bellTowerY = centerY + 410 * scale - 72 * (1.5 * scale);
            let dist = Math.hypot(b.x - bellTowerX, b.y - bellTowerY);
            let distDiff = Math.abs(dist - bellRippleProgress);
            let waveWidth = 85 * scale;
            if (distDiff < waveWidth) {
                let waveFactor = 1.0 - (distDiff / waveWidth);
                state = Math.max(state, waveFactor * bellRippleIntensity * 2.0);
                activeColor = Math.random() > 0.4 ? 'yellow' : 'white';
            }
        }

        let cacheObj = bulbCaches[activeColor] || bulbCaches['white'];
        if (!cacheObj) return;

        let img = state > 0.5 ? cacheObj.on : cacheObj.off;
        ctx.drawImage(img, b.x - bulbCacheOffset, b.y - bulbCacheOffset);
    }

    // Helper to get distance to center for radial waves
    function distToCenter(bx, by) {
        return Math.hypot(bx - centerX, by - centerY);
    }

    // --- Pattern Logic ---
    function getBulbState(b, t) {
        if (!isLightsOn) return 0; // Lights can be turned off!

        // Separate, highly readable light pattern specifically for the text!
        if (b.group.startsWith('base-text')) {
            // A beautiful, gentle wave of slight dimming that passes over the text.
            // The text is kept almost fully ON (1.0 or 0.6) so it's always completely legible!
            let wave = Math.sin(t * 0.05 - b.x * 0.02);
            return wave > 0.8 ? 0.6 : 1.0;
        }

        if (currentPattern === 'sequential') {
            // Halo breathing
            if (b.group.startsWith('halo')) {
                let layer = parseInt(b.group.split('-')[1]);
                let toggle = Math.floor(t / 20 + layer) % 2 === 0;
                return toggle ? 1 : 0.1;
            }

            // Lotus Petal wrapping panels
            if (b.group.includes('lotus')) {
                let panelNum = parseInt(b.group.split('-')[1]);
                let isLeft = b.group.includes('left');
                let speed = 4;
                let chasePos = (t * speed % (b.totalInGroup * 2));
                return Math.abs(b.index - chasePos) < 15 ? 1 : 0.2;
            }

            // Name Board Frame Chase
            if (b.group.startsWith('name-board-')) {
                // Determine direction based on side to create a unified ring chase
                let offset = 0;
                if (b.group.includes('right')) offset = 100;
                else if (b.group.includes('bottom')) offset = 200;
                else if (b.group.includes('left')) offset = 300;

                let combinedIndex = b.index + offset;
                return ((t * 8 + combinedIndex) % 60 < 20) ? 1.0 : 0.1;
            }

            // Buddhist Flags Ripple Animation
            if (b.group.startsWith('flag-')) {
                // Math.sin wave across X-coordinate to simulate rippling cloth
                let wave = Math.sin(t * 0.15 + b.x * 0.2);
                return 0.5 + (wave * 0.5); // Oscillates smoothly between 0.0 and 1.0
            }

            // Panels sync (all 10 together)
            if (b.group.startsWith('panel')) {
                let toggle = Math.floor(t / 40) % 2 === 0;
                if (b.group.includes('inner')) toggle = !toggle;
                return toggle ? 1 : 0.1;
            }

            // Spirals spinning
            if (b.group.startsWith('spiral')) {
                let chasePos = (t % b.totalInGroup);
                return (Math.abs(b.index - chasePos) % 20 < 10) ? 1 : 0.1;
            }

            // Base waves chasing
            if (b.group === 'base-wave') {
                let chasePos = ((t * 2) % b.totalInGroup);
                return (Math.abs(b.index - chasePos) < 25) ? 1 : 0;
            }

            return 1;
        }
        else if (currentPattern === 'chaser') {
            let speed = 5;
            let offset = b.index * 2;
            return ((t * speed + offset) % 100 < 20) ? 1 : 0.1;
        }
        else if (currentPattern === 'flash') {
            let flashGroupHash = Math.floor(t / 15);
            let groupHash = b.group.length + b.totalInGroup;
            return ((flashGroupHash + groupHash) % 3 === 0) ? 1 : 0;
        }
        else if (currentPattern === 'breathe') {
            let phase = b.index * 0.1 + (b.group.length * 0.5);
            return (Math.sin(t * 0.05 + phase) + 1) / 2;
        }
        else if (currentPattern === 'twinkle') {
            let hash = (b.index * 137 + b.group.length * 73 + t * 2) % 100;
            return hash < 15 ? 1 : 0.1;
        }
        else if (currentPattern === 'radial') {
            let dist = Math.hypot(b.x - centerX, b.y - centerY);
            let wave = (dist - t * 8) % 400;
            if (wave < 0) wave += 400;
            return wave < 60 ? 1 : 0.1;
        }
        else if (currentPattern === 'audioSync') {
            // No music / silence -> completely dark or very dim waiting state!
            if (currentAudioEnergy < 0.05) {
                let wave = Math.sin(t * 0.02 + b.index * 0.01);
                return wave > 0.95 ? 0.3 : 0.0; // Slow, faint twinkling like stars
            }

            // Sync to beat: higher energy = more bulbs turn on
            let threshold = 1.0 - currentAudioEnergy; // Energy 1.0 -> threshold 0 (all on)

            // Generate a fast shifting noise value for each bulb based on time
            let noise = ((b.index * 137 + b.group.length * 73 + Math.floor(t * 2)) % 100) / 100;

            // If massive beat drop, flash everything entirely!
            if (currentAudioEnergy > 0.8) {
                return (Math.floor(t * 3) % 2 === 0) ? 1.0 : 0.2;
            }

            // Normal beat sync
            return noise > threshold ? 1.0 : 0.05;
        }
        return 1;
    }

    // --- Interaction ---
    function setupInteraction() {
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            for (let i = 0; i < storyPanels.length; i++) {
                let p = storyPanels[i];
                let dist = Math.hypot(mouseX - p.x, mouseY - p.y);
                if (dist < p.radius) {
                    openStoryModal(p);
                    return; // exit loop and function if panel is clicked
                }
            }

            // Lotus Pond Interaction
            let horizonY = centerY + 410 * scale;

            // Bell Tower Interaction (Click detection for golden bell)
            let bellTowerX = centerX + 640 * scale;
            let bellTowerY = horizonY - 72 * (1.5 * scale); // Center of the bell
            let distToBell = Math.hypot(mouseX - bellTowerX, mouseY - bellTowerY);
            if (distToBell < 45 * scale) {
                // Strike the bell!
                triggerBellStrike();
                return;
            }

            if (mouseY > horizonY) {
                // User clicked on the lake
                addRipple(mouseX, mouseY);

                // Attract all koi fishes to the clicked point
                koiFishes.forEach(fish => {
                    // Only attract if they are not already too close
                    if (Math.hypot(fish.x - mouseX, fish.y - mouseY) > 30 * scale) {
                        fish.targetX = mouseX + (Math.random() - 0.5) * 40 * scale; // target slightly offset so they don't pile up
                        fish.targetY = mouseY + (Math.random() - 0.5) * 40 * scale;
                    }
                });
            }
        });




        // Setup Audio Ducking (Lower BG volume when story plays)

    } // <-- Added closing brace for setupInteraction()

    function openStoryModal(panel) { if (onPanelClick) onPanelClick(panel); }

    let audioCtx = null;
    function playOwlSound() {
        if (isDayTime) return;
        try {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') return;

            let t = audioCtx.currentTime;

            function hoot(startOffset, duration, fStart, fEnd, vol) {
                let osc = audioCtx.createOscillator();
                let gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(fStart, t + startOffset);
                osc.frequency.exponentialRampToValueAtTime(fEnd, t + startOffset + duration);

                gain.gain.setValueAtTime(0, t + startOffset);
                gain.gain.linearRampToValueAtTime(vol, t + startOffset + duration * 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, t + startOffset + duration);

                osc.start(t + startOffset);
                osc.stop(t + startOffset + duration);
            }

            // Natural Owl "Hoo.... hoo-hoo"
            hoot(0, 0.6, 350, 300, 0.05);
            hoot(1.0, 0.3, 350, 320, 0.05);
            hoot(1.4, 0.5, 330, 280, 0.05);

        } catch (e) { }
    }

    function playBirdSound() {
        if (!isDayTime) return;
        try {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') return;

            let t = audioCtx.currentTime;

            function chirp(start, freq, duration) {
                let osc = audioCtx.createOscillator();
                let gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + start);
                osc.frequency.exponentialRampToValueAtTime(freq + 800, t + start + duration);

                gain.gain.setValueAtTime(0, t + start);
                gain.gain.linearRampToValueAtTime(0.05, t + start + duration * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, t + start + duration);

                osc.start(t + start);
                osc.stop(t + start + duration);
            }

            // Pleasant "Tweet tweet"
            chirp(0, 3000, 0.1);
            chirp(0.15, 3500, 0.1);
        } catch (e) { }
    }

    function playFireworkSound(type) {
        try {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            if (type === 'launch') {
                let osc = audioCtx.createOscillator();
                let gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.8);

                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

                osc.start();
                osc.stop(audioCtx.currentTime + 0.8);
            } else if (type === 'explode') {
                const bufferSize = audioCtx.sampleRate * 1.5;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 800 + Math.random() * 1500;

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                noise.start();
            }
        } catch (e) { }
    }

    function closeModal() { }


    return {
        init: init,
        setPattern: function (p) { currentPattern = p; },
        setSpeed: function (s) { currentSpeed = s; },
        setLightsStatus: function (status) { isLightsOn = status; },
        setAudioEnergy: function (energy) { currentAudioEnergy = energy; },
        setCustomColors: function (colorsArray) {
            if (!colorsArray || colorsArray.length === 0) {
                activeColorSequence = ['blue', 'yellow', 'red', 'white', 'orange'];
            } else {
                activeColorSequence = colorsArray;
            }
            setupGeometry(); // Re-generate pandal with new colors
        },
        launchFirework: function () {
            playFireworkSound('launch');
            const colors = ['#ff0000', '#00ff00', '#0044ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800'];

            // Launch 3 fireworks at once with slight stagger
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    fireworks.push({
                        x: width * 0.3 + Math.random() * width * 0.4,
                        y: height,
                        vx: (Math.random() - 0.5) * 5, // Spread in different horizontal directions
                        speed: 13 + Math.random() * 6, // Random height
                        color: colors[Math.floor(Math.random() * colors.length)],
                        state: 'launch',
                        particles: []
                    });
                }, i * 250); // 250ms stagger
            }
        },
        spawnLamp: function () {
            let lakeStart = centerY + 410 * scale;
            let lakeHeight = height - lakeStart;

            // Calculate a safe target Y that is within the lake area
            let tY;
            if (lakeHeight > 20 * scale) {
                // If lake is tall enough, spawn somewhere within it
                tY = lakeStart + (lakeHeight * 0.2) + Math.random() * (lakeHeight * 0.6);
            } else {
                // Fallback for very short screens
                tY = height - 20 * scale;
            }

            offeredLamps.push({
                id: Math.random() * 1000,
                x: centerX + (Math.random() - 0.5) * (width * 0.8), // Spread across lake
                y: tY + 80 * scale, // Start just below target to rise up
                targetY: tY,
                alpha: 0.2,
                scale: 0.8 + Math.random() * 0.4
            });

            // Spawn glowing sky lanterns floating up behind the pandal!
            spawnSkyLanterns();

            // Keep max 30 lamps visible to avoid lag
            if (offeredLamps.length > 30) {
                offeredLamps.shift();
            }
        },
        spawnLotus: function (color) {
            let lakeStart = centerY + 410 * scale;
            let lakeHeight = height - lakeStart;

            // Calculate a safe target Y that is within the lake area
            let tY;
            if (lakeHeight > 20 * scale) {
                tY = lakeStart + (lakeHeight * 0.2) + Math.random() * (lakeHeight * 0.6);
            } else {
                tY = height - 20 * scale;
            }

            offeredLotuses.push({
                id: Math.random() * 1000,
                color: color || 'pink', // 'pink' or 'blue'
                x: centerX + (Math.random() - 0.5) * (width * 0.8), // Spread across lake
                y: tY + 80 * scale,
                targetY: tY,
                alpha: 0.2,
                scale: 0.8 + Math.random() * 0.4
            });

            // Spawn glowing sky lanterns floating up behind the pandal!
            spawnSkyLanterns();

            // Keep max 30 lotuses visible to avoid lag
            if (offeredLotuses.length > 30) {
                offeredLotuses.shift();
            }
        },
        setPerformanceMode: function (enabled) {
            performanceMode = !!enabled;
            resize();
        },
        destroy: function () {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        }
    };
}
