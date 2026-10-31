(() => {
  const sidebarSelector = '.CCpbui';
  const handleId = 'bale-custom-sidebar-resizer';
  const storageKey = 'sidebarWidth';
  const minimumWidth = 280;
  const maximumWidth = 720;
  const desktopQuery = window.matchMedia('(min-width: 992px)');

  let sidebar;
  let handle;
  let dragState;

  const clamp = (value) => Math.min(maximumWidth, Math.max(minimumWidth, value));

  function setSidebarWidth(width, persist = false) {
    const value = `${clamp(width)}px`;
    sidebar.style.setProperty('--sidebar-width', value, 'important');
    if (persist) chrome.storage.local.set({ [storageKey]: value });
  }

  function positionHandle() {
    if (!sidebar || !handle) return;
    const rect = sidebar.getBoundingClientRect();
    const sidebarIsOnLeft = rect.left + rect.width / 2 < window.innerWidth / 2;
    handle.style.left = `${sidebarIsOnLeft ? rect.right - 4 : rect.left - 4}px`;
    handle.dataset.edge = sidebarIsOnLeft ? 'right' : 'left';
  }

  function endDrag() {
    if (!dragState) return;
    dragState = undefined;
    handle.classList.remove('is-dragging');
    document.documentElement.style.userSelect = '';
  }

  function beginDrag(event) {
    if (!desktopQuery.matches || event.button !== 0) return;
    const rect = sidebar.getBoundingClientRect();
    dragState = { rect, edge: handle.dataset.edge };
    handle.classList.add('is-dragging');
    handle.setPointerCapture(event.pointerId);
    document.documentElement.style.userSelect = 'none';
    event.preventDefault();
  }

  function drag(event) {
    if (!dragState) return;
    const width = dragState.edge === 'right'
      ? event.clientX - dragState.rect.left
      : dragState.rect.right - event.clientX;
    setSidebarWidth(width);
    positionHandle();
  }

  function mount() {
    sidebar = document.querySelector(sidebarSelector);
    if (!sidebar || handle) return;

    handle = document.createElement('div');
    handle.id = handleId;
    handle.setAttribute('aria-label', 'Resize sidebar');
    handle.setAttribute('role', 'separator');
    document.body.append(handle);

    handle.addEventListener('pointerdown', beginDrag);
    handle.addEventListener('pointermove', drag);
    handle.addEventListener('pointerup', () => {
      if (dragState) chrome.storage.local.set({ [storageKey]: sidebar.style.getPropertyValue('--sidebar-width') });
      endDrag();
    });
    handle.addEventListener('pointercancel', endDrag);

    chrome.storage.local.get(storageKey, (result) => {
      const savedWidth = Number.parseInt(result[storageKey], 10);
      if (Number.isFinite(savedWidth)) setSidebarWidth(savedWidth);
      positionHandle();
    });
    new ResizeObserver(positionHandle).observe(sidebar);
    window.addEventListener('resize', positionHandle);
    desktopQuery.addEventListener('change', positionHandle);
    positionHandle();
  }

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();
