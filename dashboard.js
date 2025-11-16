import { supabase } from './supabaseClient.js';  
 function toggleProfileMenu() {
      const profileMenu = document.getElementById("profile-menu");
      profileMenu.classList.toggle("show");
    }

    document.querySelectorAll('.toggle-menu').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const submenu = btn.nextElementSibling;

        document.querySelectorAll('.submenu').forEach(list => {
          if (list !== submenu) list.classList.remove('show');
        });

        submenu.classList.toggle('show');
      });
    });