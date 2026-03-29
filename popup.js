document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('titleInput');
    const urlInput = document.getElementById('urlInput');
    const categoryInput = document.getElementById('categoryInput');
    const saveBtn = document.getElementById('saveBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const linksContainer = document.getElementById('linksContainer');
    const categoryList = document.getElementById('categoryList');
    const searchInput = document.getElementById('searchInput');
    const notification = document.getElementById('notification');

    let editModeUrl = null;

    const showToast = (message, type = 'error') => {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.className = 'notification hidden';
        }, 3000);
    };

    const fetchCurrentTab = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const currentTab = tabs[0];
                titleInput.value = currentTab.title;
                urlInput.value = currentTab.url;
            }
        });
    };

    const resetForm = () => {
        editModeUrl = null;
        saveBtn.textContent = 'حفظ';
        cancelEditBtn.classList.add('hidden');
        categoryInput.value = '';
        fetchCurrentTab();
    };

    const displayLinks = (searchTerm = '') => {
        chrome.storage.local.get(['savedLinks'], (result) => {
            const links = result.savedLinks || [];
            linksContainer.innerHTML = ''; 

            const uniqueCategories = [...new Set(links.map(link => link.category || 'عام'))];
            categoryList.innerHTML = '';
            uniqueCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                categoryList.appendChild(option);
            });

            const isSearching = searchTerm.trim().length > 0;

            const filteredLinks = links.filter(link => {
                const searchLower = searchTerm.toLowerCase();
                const titleLower = (link.title || '').toLowerCase();
                const categoryLower = (link.category || 'عام').toLowerCase();
                return titleLower.includes(searchLower) || categoryLower.includes(searchLower);
            });

            const groupedLinks = filteredLinks.reduce((acc, link) => {
                const cat = link.category || 'عام';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(link);
                return acc;
            }, {});

            for (const [category, catLinks] of Object.entries(groupedLinks)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'category-group';
                
                const title = document.createElement('div');
                title.textContent = category;
                
                const ul = document.createElement('ul');
                ul.className = 'link-list';

                if (!isSearching) {
                    title.className = 'category-title collapsed';
                    ul.classList.add('hidden');
                } else {
                    title.className = 'category-title';
                }

                title.addEventListener('click', () => {
                    title.classList.toggle('collapsed');
                    ul.classList.toggle('hidden');
                });

                groupDiv.appendChild(title);

                catLinks.forEach(link => {
                    const li = document.createElement('li');
                    li.className = 'link-item';
                    
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = '_blank';
                    a.textContent = link.title;
                    
                    const actionBtns = document.createElement('div');
                    actionBtns.className = 'action-btns';

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'تعديل';
                    editBtn.className = 'edit-btn';
                    editBtn.addEventListener('click', () => {
                        titleInput.value = link.title;
                        categoryInput.value = link.category;
                        urlInput.value = link.url;
                        editModeUrl = link.url;
                        saveBtn.textContent = 'تحديث';
                        cancelEditBtn.classList.remove('hidden');
                        window.scrollTo(0, 0);
                    });

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'حذف';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.addEventListener('click', () => {
                        deleteLink(link.url);
                    });

                    actionBtns.appendChild(editBtn);
                    actionBtns.appendChild(deleteBtn);

                    li.appendChild(a);
                    li.appendChild(actionBtns);
                    ul.appendChild(li);
                });
                
                groupDiv.appendChild(ul);
                linksContainer.appendChild(groupDiv);
            }
        });
    };

    const deleteLink = (urlToDelete) => {
        chrome.storage.local.get(['savedLinks'], (result) => {
            let links = result.savedLinks || [];
            links = links.filter(link => link.url !== urlToDelete);
            
            chrome.storage.local.set({ savedLinks: links }, () => {
                displayLinks(searchInput.value); 
            });
        });
    };

    saveBtn.addEventListener('click', () => {
        const newLink = {
            title: titleInput.value,
            url: urlInput.value,
            category: categoryInput.value.trim() || 'عام'
        };

        chrome.storage.local.get(['savedLinks'], (result) => {
            let links = result.savedLinks || [];
            
            if (editModeUrl) {
                const index = links.findIndex(l => l.url === editModeUrl);
                if (index !== -1) {
                    links[index].title = newLink.title;
                    links[index].category = newLink.category;
                    chrome.storage.local.set({ savedLinks: links }, () => {
                        resetForm();
                        displayLinks(searchInput.value);
                        showToast('تم التحديث بنجاح', 'success');
                    });
                }
            } else {
                const existingLink = links.find(link => link.url === newLink.url);
                
                if (!existingLink) {
                    links.push(newLink);
                    chrome.storage.local.set({ savedLinks: links }, () => {
                        resetForm(); 
                        displayLinks(searchInput.value);
                        showToast('تم حفظ الرابط بنجاح', 'success');
                    });
                } else {
                    showToast(`هذا الرابط محفوظ مسبقا باسم: ${existingLink.title}`, 'error');
                }
            }
        });
    });

    cancelEditBtn.addEventListener('click', () => {
        resetForm();
    });

    searchInput.addEventListener('input', (e) => {
        displayLinks(e.target.value);
    });

    fetchCurrentTab();
    displayLinks();
});