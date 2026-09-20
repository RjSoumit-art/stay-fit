$(function () {
  const $body = $("body");

  $("<style>").text(
    ".navbarlinks.is-open{display:block!important}.menu-open{overflow:hidden}" +
    ".input-error{border-color:#ff6b6b!important;outline:1px solid #ff6b6b}" +
    "#siteNotice{position:fixed;z-index:9999;right:24px;bottom:24px;max-width:320px;padding:14px 20px;background:#d7fb00;color:#111;border-radius:4px;font-weight:600;opacity:0;transform:translateY(15px);transition:.25s ease;pointer-events:none}" +
    "#siteNotice.is-visible{opacity:1;transform:translateY(0)}" +
    ".site-dialog{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.72)}" +
    ".site-dialog__box{position:relative;width:min(420px,100%);padding:34px;background:#171e2e;border:1px solid #d7fb00;box-shadow:0 20px 60px #0008}" +
    ".site-dialog__box h3{margin:0 0 8px;color:#d7fb00;font-size:28px}.site-dialog__box p{margin-bottom:20px}" +
    ".site-dialog__box input{display:block;width:100%;margin:10px 0;padding:12px;border:1px solid #687080;background:transparent;color:#fff}" +
    ".site-dialog__close{position:absolute;right:12px;top:8px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}" +
    ".site-dialog__submit{width:100%;padding:13px;border:0;background:#d7fb00;color:#111;font-weight:700;cursor:pointer}" +
    "@media(max-width:900px){.navbarlinks{display:none}.navbarlinks.is-open{position:absolute;top:90px;left:15px;right:15px;padding:15px;background:#171e2e;border:1px solid #d7fb00;z-index:20}.navbarlinks.is-open .navlinks{display:flex;flex-direction:column;align-items:flex-start}.header-right{margin-left:auto}.header-icons{margin-right:8px}}"
  ).appendTo("head");

  // Keep the original design intact while adding a small responsive menu.
  $(".header-icons div:has(.hgi-menu-02)").on("click", function () {
    $(".navbarlinks").toggleClass("is-open");
    $body.toggleClass("menu-open");
  });

  $(".navlinks a").on("click", function () {
    $(".navbarlinks").removeClass("is-open");
    $body.removeClass("menu-open");
  });

  // Header search filters service and blog cards when a matching card exists.
  $(".header-icons div:has(.hgi-search-01)").on("click", function () {
    const query = window.prompt("Search services or articles:");
    if (query === null) return;
    const term = $.trim(query).toLowerCase();
    const $cards = $(".service-card, .blog-card");
    if (!$cards.length) {
      showNotice("Search is available on the services and blog pages.");
      return;
    }
    $cards.each(function () {
      $(this).closest(".col33").toggle(!term || $(this).text().toLowerCase().includes(term));
    });
    if (term && !$cards.filter(function () { return $(this).is(":visible"); }).length) {
      showNotice("No matching results found.");
    }
  });

  // Open a lightweight membership/enrollment dialog for CTA buttons.
  $(".header-btn button, .cmn-btn, .enroll-btn").on("click", function (event) {
    const href = $(this).attr("href");
    if (href && href !== "#") return;
    event.preventDefault();
    openMembershipDialog($(this).text().trim() || "Join now");
  });

  // Contact form: client-side validation and a friendly success message.
  $("form").on("submit", function (event) {
    event.preventDefault();
    const $form = $(this);
    let valid = true;
    $form.find("[required]").each(function () {
      const filled = $.trim($(this).val()) !== "";
      $(this).toggleClass("input-error", !filled);
      valid = valid && filled;
    });
    if (!valid) {
      showNotice("Please complete all required fields.");
      return;
    }
    $form[0].reset();
    showNotice("Thanks! Your request has been sent successfully.");
  });


  $(".footer input[type='email']").on("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const email = $.trim($(this).val());
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotice("Please enter a valid email address.");
      return;
    }
    $(this).val("");
    showNotice("You are subscribed to Stayfit updates.");
  });

  function showNotice(message) {
    let $notice = $("#siteNotice");
    if (!$notice.length) {
      $notice = $("<div id='siteNotice' role='status'></div>").appendTo("body");
    }
    $notice.stop(true, true).text(message).addClass("is-visible");
    window.clearTimeout(window.siteNoticeTimer);
    window.siteNoticeTimer = window.setTimeout(function () {
      $notice.removeClass("is-visible");
    }, 3200);
  }

  function openMembershipDialog(action) {
    if ($("#membershipDialog").length) return;
    const $dialog = $(
      "<div id='membershipDialog' class='site-dialog' role='dialog' aria-modal='true' aria-label='Membership enquiry'>" +
        "<div class='site-dialog__box'><button class='site-dialog__close' aria-label='Close'>&times;</button>" +
        "<h3>Start your Stayfit journey</h3><p>Tell us how we can help with your membership.</p>" +
        "<input type='text' placeholder='Your name' required><input type='tel' placeholder='Phone number' required>" +
        "<button class='site-dialog__submit'>Send enquiry</button></div></div>"
    ).appendTo("body");
    $dialog.find("input:first").trigger("focus");
    $dialog.on("click", function (event) {
      if (event.target === this || $(event.target).hasClass("site-dialog__close")) $dialog.remove();
    });
    $dialog.find(".site-dialog__submit").on("click", function () {
      const filled = $dialog.find("input").toArray().every(function (input) { return $.trim(input.value); });
      if (!filled) { showNotice("Please enter your name and phone number."); return; }
      $dialog.remove();
      showNotice(action + " request received. We will contact you soon.");
    });
  }
});
