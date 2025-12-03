function toggleMenu() {
            const menu = document.getElementById('menu');
            menu.classList.toggle('active');
        }

        function closeMenu() {
            const menu = document.getElementById('menu');
            menu.classList.remove('active');
        }

        function handleOrder(event) {
            event.preventDefault();

            const nom = document.getElementById('nom').value;
            const email = document.getElementById('email').value;
            const telephone = document.getElementById('telephone').value;
            const produit = document.getElementById('produit').value;
            const quantite = document.getElementById('quantite').value;
            const details = document.getElementById('details').value;

            const message = `Nouvelle commande:\n\nNom: ${nom}\nEmail: ${email}\nTéléphone: ${telephone}\nProduit: ${produit}\nQuantité: ${quantite}\n\nDétails:\n${details}`;

            // Rediriger vers WhatsApp
            const whatsappUrl = `https://wa.me/22793627145?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            alert('✅ Merci ! Vous allez être redirigé vers WhatsApp pour finaliser votre commande.');
            document.querySelector('form').reset();
        }

        // CSS pour le menu mobile
        const style = document.createElement('style');
        style.textContent = `
            #menu.active {
                display: flex !important;
            }
        `;
        document.head.appendChild(style);

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener('click', function(event) {
            const nav = document.querySelector('nav');
            const menu = document.getElementById('menu');
            const toggle = document.querySelector('.menu-toggle');
            
            if (!nav.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });