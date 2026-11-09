(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initHeader();
    initNav();
    initReveal();
    initYear();
    initShopifyBuy();
    initTilt();
    initParallax();
    initTeamGallery();
    initContactMenu();
    var startView = document.querySelector(".view.active");
    if(startView) startView.classList.add("view-in");
    requestAnimationFrame(function(){ document.body.classList.add("loaded"); });
  });

  /* ---------------- footer contact: choose Mail app or Gmail ---------------- */
  function initContactMenu(){
    var toggle = document.getElementById("contact-toggle");
    var panel = document.getElementById("contact-options");
    if(!toggle || !panel) return;
    function setOpen(open){
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function(e){
      e.preventDefault();
      setOpen(panel.hidden);
    });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") setOpen(false); });
  }

  /* ---------------- team gallery: clone real photos, jump to full bio ---------------- */
  function initTeamGallery(){
    document.querySelectorAll(".team-gallery-item").forEach(function(btn){
      var needle = (btn.getAttribute("data-clone-alt") || "").toLowerCase();
      var imgs = document.querySelectorAll(".team-photo img[alt]");
      for(var i = 0; i < imgs.length; i++){
        if(imgs[i].getAttribute("alt").toLowerCase().indexOf(needle) !== -1){
          var clone = imgs[i].cloneNode(true);
          clone.removeAttribute("id");
          var wrap = document.createElement("span");
          wrap.className = "photo-wrap";
          wrap.appendChild(clone);
          btn.insertBefore(wrap, btn.firstChild);
          break;
        }
      }
      btn.addEventListener("click", function(){
        var target = document.getElementById(btn.getAttribute("data-goto"));
        if(target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------------- eye-candy: tilt, parallax, confetti ---------------- */
  function initTilt(){
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if(!canHover) return; // skip entirely on touch/mobile
    document.querySelectorAll(".product-card").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateY = x * 9;
        var rotateX = y * -9;
        card.style.transform = "perspective(800px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  }

  function initParallax(){
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced || window.innerWidth < 760) return; // skip on mobile / reduced-motion
    var els = document.querySelectorAll("[data-parallax]");
    if(!els.length) return;
    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      els.forEach(function(el){
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * speed * -1;
        el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function(){
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function burstConfetti(originEl){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var rect = originEl.getBoundingClientRect();
    var originX = rect.left + rect.width / 2;
    var originY = rect.top + rect.height / 2;
    var colors = ["#8B2332", "#3D1116", "#E7B9BE", "#FFFFFF"];
    var count = window.innerWidth < 480 ? 9 : 14;
    for(var i = 0; i < count; i++){
      var el = document.createElement("span");
      el.className = "confetti-bit";
      var angle = Math.random() * Math.PI * 2;
      var dist = 55 + Math.random() * 55;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 30;
      el.style.left = originX + "px";
      el.style.top = originY + "px";
      el.style.background = colors[i % colors.length];
      el.style.setProperty("--dx", dx.toFixed(0) + "px");
      el.style.setProperty("--dy", dy.toFixed(0) + "px");
      el.style.setProperty("--rot", (Math.random() * 360).toFixed(0) + "deg");
      document.body.appendChild(el);
      el.addEventListener("animationend", function(){ this.remove(); });
    }
  }

  function initHeader(){
    var header = document.querySelector(".site-header");
    if(!header) return;
    var onScroll = function(){ header.classList.toggle("is-compact", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav(){
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if(!toggle || !nav) return;
    toggle.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  var io;
  function initReveal(){
    var items = document.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window)){
      items.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function(el){ io.observe(el); });
  }

  /* =====================================================================
     SHOPIFY — real cart + checkout, connected to the Hesedea store
     -------------------------------------------------------------------
     Several product cards share one Shopify product with color variants
     (e.g. Off Black Tee / Off White Tee are one "Tee" product). Each
     entry below pairs a product ID with the color to pick out of that
     product's variants, so the right color always lands in the cart.
  ===================================================================== */
  var SHOPIFY_CONFIG = {
    domain: "hesedea-ct1uv4cd.myshopify.com",
    storefrontAccessToken: "b93f0ee71d78e0e490fe1d1396e49a06",
    products: {
      "off-black-tee":     { id: "10301623500848", color: null },
      "off-white-tee":     { id: "10301623337008", color: null },
      "white-long-sleeve": { id: "10301622255664", color: null },
      "grey-long-sleeve":  { id: "10301585752112", color: null },
      "ivory-crewneck":    { id: "10301621567536", color: null },
      "maroon-crewneck":   { id: "10301623140400", color: null },
      "womens-black-tee":  { id: "10301622845488", color: null },
      "womens-bone-tee":   { id: "10301622616112", color: null },
      "rope-cap":          { id: "10301621829680", color: null }
    }
  };

  var shopifyClient = null;
  var shopifyCheckout = null;
  var shopifyProductCache = {};
  var CHECKOUT_STORAGE_KEY = "hesedea_checkout_id";

  function initShopifyBuy(){
    if(!SHOPIFY_CONFIG.storefrontAccessToken || SHOPIFY_CONFIG.storefrontAccessToken.indexOf("PASTE_") === 0){
      return; // not configured — leave the static "Notify Me" buttons in place
    }
    var script = document.createElement("script");
    script.src = "https://sdks.shopifycdn.com/buy-button/latest/buybutton.js";
    script.onload = function(){ setupShopifyBuy(); };
    document.body.appendChild(script);
  }

  function setupShopifyBuy(){
    shopifyClient = ShopifyBuy.buildClient({
      domain: SHOPIFY_CONFIG.domain,
      storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken
    });

    getOrCreateCheckout().then(function(checkout){
      shopifyCheckout = checkout;
      renderCart();
    });

    document.querySelectorAll("[data-shopify-buy]").forEach(function(slot){
      var slug = slot.getAttribute("data-shopify-buy");
      var config = SHOPIFY_CONFIG.products[slug];
      if(!config || !config.id) return; // product not mapped yet — leave "Notify Me"
      setupProductSlot(slot, config, slug);
    });

    // Price-only cards (e.g. the Home page picks) have no buy slot on this
    // page, so fetch their live Shopify price directly.
    var priceOnly = {};
    document.querySelectorAll("[data-shopify-price]").forEach(function(el){
      var slug = el.getAttribute("data-shopify-price");
      if(!document.querySelector('[data-shopify-buy="' + slug + '"]')) priceOnly[slug] = true;
    });
    Object.keys(priceOnly).forEach(function(slug){
      var config = SHOPIFY_CONFIG.products[slug];
      if(!config || !config.id) return;
      fetchColorVariants(config).then(function(variants){
        if(variants.length) showShopifyPrice(slug, variants);
      }).catch(function(){});
    });

    document.querySelectorAll("[data-cart-open]").forEach(function(btn){
      btn.addEventListener("click", openCartDrawer);
    });
    document.querySelectorAll("[data-cart-close]").forEach(function(btn){
      btn.addEventListener("click", closeCartDrawer);
    });
    var overlay = document.querySelector(".cart-overlay");
    if(overlay) overlay.addEventListener("click", closeCartDrawer);
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeCartDrawer(); });
  }

  function getOrCreateCheckout(){
    var existingId = null;
    try { existingId = localStorage.getItem(CHECKOUT_STORAGE_KEY); } catch(e){}
    if(!existingId) return createNewCheckout();

    return shopifyClient.checkout.fetch(existingId).then(function(checkout){
      if(checkout && !checkout.completedAt) return checkout;
      return createNewCheckout();
    }).catch(createNewCheckout);
  }

  function createNewCheckout(){
    return shopifyClient.checkout.create().then(function(checkout){
      try { localStorage.setItem(CHECKOUT_STORAGE_KEY, checkout.id); } catch(e){}
      return checkout;
    });
  }

  function fetchColorVariants(config){
    var cached = shopifyProductCache[config.id];
    var fetchPromise = cached ? Promise.resolve(cached) : shopifyClient.product.fetch(btoa("gid://shopify/Product/" + config.id)).then(function(product){
      shopifyProductCache[config.id] = product;
      return product;
    });

    return fetchPromise.then(function(product){
      if(!product || !product.variants || !product.variants.length) return [];
      if(!config.color) return product.variants;

      var needle = config.color.toLowerCase();
      var matches = product.variants.filter(function(v){ return v.title.toLowerCase().indexOf(needle) !== -1; });
      return matches.length ? matches : product.variants;
    });
  }

  // "black / s" -> "S", "Black/White / One Size" -> "One Size". Takes a
  // variant (uses its "Size" option) or a variant title (uses the text
  // after the last "/"). Letter sizes are uppercased; others kept as-is.
  function sizeLabel(variant){
    var size = null;
    var options = typeof variant === "object" && variant ? variant.selectedOptions : null;
    (options || []).forEach(function(o){
      if(o.name && o.name.toLowerCase() === "size") size = o.value;
    });
    if(size === null){
      var title = typeof variant === "string" ? variant : (variant && variant.title) || "";
      size = title.slice(title.lastIndexOf("/") + 1);
    }
    size = size.trim();
    return /^(x*[sml]|\d+x[sl])$/i.test(size) ? size.toUpperCase() : size;
  }

  function setupProductSlot(slot, config, slug){
    fetchColorVariants(config).then(function(variants){
      if(!variants.length) return; // couldn't resolve this color — leave "Notify Me"

      showShopifyPrice(slug, variants);

      var btn = slot.querySelector("button");
      if(!btn) return;

      var select = document.createElement("select");
      select.className = "size-select";
      select.setAttribute("aria-label", "Size");
      variants.forEach(function(v){
        var opt = document.createElement("option");
        opt.value = v.id;
        opt.textContent = sizeLabel(v) + (v.available ? "" : " (Sold out)");
        opt.disabled = !v.available;
        select.appendChild(opt);
      });
      var firstAvailable = variants.filter(function(v){ return v.available; })[0];
      if(firstAvailable) select.value = firstAvailable.id;

      slot.insertBefore(select, btn);

      // Picking a size shows that size's price (XXL+ can cost more)
      var priceEl = slot.closest(".product-card").querySelector("[data-shopify-price]");
      select.addEventListener("change", function(){
        var picked = variants.filter(function(v){ return v.id === select.value; })[0];
        if(picked && priceEl) priceEl.textContent = formatCardPrice(variantAmount(picked));
      });

      var anyAvailable = variants.some(function(v){ return v.available; });
      btn.disabled = !anyAvailable;
      btn.textContent = anyAvailable ? "Add to Cart" : "Sold Out";
      btn.addEventListener("click", function(){ addToCart(select.value, btn); });
    });
  }

  // Replace the hard-coded card price with Shopify's on every card for
  // this product. Prices that vary by size show the lowest as "From $x".
  // If Shopify can't be reached this never runs and the HTML price stays.
  function showShopifyPrice(slug, variants){
    var amounts = variants.map(variantAmount);
    var min = Math.min.apply(null, amounts);
    var max = Math.max.apply(null, amounts);
    var text = (max > min ? "From " : "") + formatCardPrice(min);
    document.querySelectorAll('[data-shopify-price="' + slug + '"]').forEach(function(el){
      el.textContent = text;
    });
  }

  function variantAmount(variant){
    var price = variant.price;
    return parseFloat(typeof price === "object" && price ? price.amount : price);
  }

  // 36 -> "$36", 31.5 -> "$31.50" (matches the cards' whole-dollar style)
  function formatCardPrice(amount){
    return "$" + (amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2));
  }

  function addToCart(variantId, btn){
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Adding...";

    shopifyClient.checkout.addLineItems(shopifyCheckout.id, [{ variantId: variantId, quantity: 1 }])
      .then(function(updatedCheckout){
        shopifyCheckout = updatedCheckout;
        renderCart();
        btn.textContent = "Added";
        burstConfetti(btn);
        openCartDrawer();
        setTimeout(function(){ btn.disabled = false; btn.textContent = originalText; }, 1800);
      }).catch(function(err){
        console.error("Hesedea: add to cart failed —", err);
        btn.disabled = false;
        btn.textContent = originalText;
      });
  }

  function removeLine(lineItemId){
    shopifyClient.checkout.removeLineItems(shopifyCheckout.id, [lineItemId]).then(function(updatedCheckout){
      shopifyCheckout = updatedCheckout;
      renderCart();
    });
  }

  function renderCart(){
    if(!shopifyCheckout) return;
    var countEl = document.getElementById("cart-count");
    var bodyEl = document.getElementById("cart-drawer-body");
    var totalEl = document.getElementById("cart-drawer-total");
    var checkoutLink = document.getElementById("cart-checkout-link");

    var items = shopifyCheckout.lineItems || [];
    var count = items.reduce(function(sum, li){ return sum + li.quantity; }, 0);

    if(countEl){
      countEl.textContent = count;
      countEl.classList.toggle("show", count > 0);
    }
    if(checkoutLink) checkoutLink.href = shopifyCheckout.webUrl;
    if(totalEl) totalEl.textContent = formatMoney(shopifyCheckout.subtotalPrice);

    if(bodyEl){
      bodyEl.classList.toggle("has-items", items.length > 0);
      if(items.length === 0){
        bodyEl.innerHTML = '<p>Your cart is empty.</p>';
      } else {
        bodyEl.innerHTML = items.map(function(li){
          var variantLine = (li.variant && li.variant.title && li.variant.title !== "Default Title")
            ? '<p class="cart-line-variant">' + escapeHtml(li.variant.title) + '</p>' : '';
          return '<div class="cart-line">' +
            '<div class="cart-line-info">' +
              '<p class="cart-line-title">' + escapeHtml(li.title) + '</p>' +
              variantLine +
              '<p class="cart-line-price">' + formatMoney(li.variant ? li.variant.price : null) + '</p>' +
              '<p class="cart-line-qty">Qty ' + li.quantity + '</p>' +
            '</div>' +
            '<button class="cart-line-remove" data-remove-line="' + li.id + '" aria-label="Remove item">&times;</button>' +
          '</div>';
        }).join("");
        bodyEl.querySelectorAll("[data-remove-line]").forEach(function(btn){
          btn.addEventListener("click", function(){ removeLine(btn.getAttribute("data-remove-line")); });
        });
      }
    }
  }

  function formatMoney(price){
    if(!price) return "$0.00";
    var amount = typeof price === "object" ? price.amount : price;
    return "$" + parseFloat(amount).toFixed(2);
  }

  function escapeHtml(str){
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function openCartDrawer(){
    var overlay = document.querySelector(".cart-overlay");
    var drawer = document.querySelector(".cart-drawer");
    if(!overlay || !drawer) return;
    overlay.classList.add("open");
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCartDrawer(){
    var overlay = document.querySelector(".cart-overlay");
    var drawer = document.querySelector(".cart-drawer");
    if(!overlay || !drawer) return;
    overlay.classList.remove("open");
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  function initYear(){
    var el = document.querySelector("[data-year]");
    if(el) el.textContent = new Date().getFullYear();
  }


})();
