<!-- title: 程式套色測試 -->
<!-- description: 一樣只是個測試 -->
<!-- category: test -->
<!-- tags: test -->
<!-- published time: 2023/08/30 -->

```js
/*
 * 2023 © MaoHuPi
 * 將markdown轉換成剪報形式的html
 * blogTemplate_thread > public > script > slides.js
 */

'use strict';

class Slides{
	#element;
	static $(e, f = document){
		let r;
		try {r = f.querySelector(e);}
		catch(error){r = false;}
		return(r);
	}
	static $$(e, f = document){
		let r;
		try {r = [...f.querySelectorAll(e)];}
		catch(error){r = [];}
		return(r);
	}
	static e(tagName){
		let element = document.createElement(tagName);
		element.style.margin = '0px';
		element.style.padding = '0px';
		element.style.color = 'black';
		element.style.fontSize = '10px';
		element.style.fontWeight = 'normal';
		element.style.lineHeight = 'unset';
		element.style.borderWidth = '0px';
		element.style.outline = 'none';
		return element;
	}
	constructor(markdown = '', option = {}){
		this.content = $e('div');
		this.content.className = 'content';
		markdown = markdown.replace(/\n\t/g, '\n');
		// markdown = markdown.replace(/(\n(> )+|((> )*(#+|([*\-+]( \[ \]){0,1})))|(  +\n))/g, '<br>');
		let scriptFlat = false, scriptLanguage = '';
		markdown = markdown.split('\n');
		let newMarkdown = [];
		for(let i = 0; i < markdown.length; i++){
			if(markdown[i].indexOf('```') === 0 && !scriptFlat){
				scriptFlat = true;
				scriptLanguage = markdown[i].replace('```', '');
			}
			else if(markdown[i] === '```'){
				scriptFlat = false;
				scriptLanguage = '';
			}
			else{
				newMarkdown.push(scriptFlat ? `<pre><code class="hljs${scriptLanguage !== '' ? ' language-' + scriptLanguage : ''}">${markdown[i]}</code></pre>\n` : markdown[i])
			}
		}
		markdown = newMarkdown.join('\n');
		markdown = markdown.replace(/\n((> )+|((> )*(#+|([*\-+]( \[ \]){0,1})))|(  +\n))/g, '\n<br>$1');
		markdown = markdown.replace(/\n>\n/g, '\n\n');
		markdown = markdown.replace(/\n\n+/g, '<br>');
		markdown = markdown.replace(/\n/g, ' ');
		markdown = markdown.replaceAll('<br>', '\n');
		markdown = markdown.replace(/\n+/g, '\n');
		markdown = markdown.split('\n').map(line => marked.parse(line)).join('\n');
		this.content.innerHTML = markdown;
		this.style = option.style || Slides.typeA;
	}
	getElement(){
		if(this.#element){
			return this.#element;
		}
		function processElementLevel(oldElementLevelList, parentIndexList = []){
			if(oldElementLevelList.length == 0){
				return [];
			}
			let elementLevelNow = Math.min(...oldElementLevelList.map(element => element.level))
			let newElementLevelList = [];
			let childList = [];
			for(let element of oldElementLevelList){
				if(element.level === elementLevelNow){
					childList = [];
					newElementLevelList.push({element:element, child:childList});
				}
				else{
					childList.push(element);
				}
			}
			for(let i = 0; i < newElementLevelList.length; i++){
				let layerData = newElementLevelList[i];
				layerData.element.indexList = [...parentIndexList, i];
				layerData.child = processElementLevel(layerData.child, layerData.element.indexList);
			}
			return newElementLevelList;
		}
		let titlesList = [...Slides.$$('.content > *', this.content)];
		titlesList.forEach(element => {
			var level = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(element.tagName.toLowerCase());
			level = level === -1 ? 1e3 : level;
			element.level = level;
		})
		let contentLayerData = processElementLevel(titlesList);
		let slides = Slides.e('div');
		slides.width = 1280;
		slides.height = 720;
		slides.className = 'slides';
		slides.setAttribute('width', 1280);
		slides.setAttribute('height', 720);
		slides.style.width = slides.width + 'px';
		slides.style.height = slides.height + 'px';
		slides.style.backgroundColor = 'white';
		slides.style.overflowX = 'hidden';
		slides.style.overflowY = 'scroll';
		slides.style.scrollSnapType = 'y mandatory';
		slides.style.scrollBehavior = 'smooth';
		let elementStorage = [];
		for(let element of Slides.$$('.content > *', this.content)){
			this.style(slides, element, elementStorage, contentLayerData);
		}
		this.#element = slides;
		return slides;
	}
	static typeA(slides, element, elementStorage, contentLayerData){
		/*
		 * |-----------------------------|
		 * |                             |
		 * |                             |
		 * |           Title 1           |
		 * |                             |
		 * |                             |
		 * |-----------------------------|
		 * |-----------------------------|
		 * | Title 2                     |
		 * |  Title 3                    |
		 * |   content...                |
		 * |   content...                |
		 * |   content...                |
		 * |-----------------------------|
		 * |-----------------------------|
		 * |   content...                |
		 * |   content...                |
		 * |   content...                |
		 * |   content...                |
		 * |   content...                |
		 * |-----------------------------|
		 */
		slides.padding = 50;
		function createPage(){
			var page = Slides.e('div');
			page.className = 'slide';
			page.style.width = slides.width + 'px';
			page.style.height = slides.height + 'px';
			page.style.overflow = 'hidden';
			page.style.scrollSnapAlign = 'start';
			page.contentHeight = 0;
			let _page_appendChild = page.appendChild.bind(page);
			page.appendChild = function(element, recordHeight = true){
				if(recordHeight){
					document.body.appendChild(element);
					page.contentHeight += element.offsetHeight;
					element.remove();
				}
				_page_appendChild(element);
			}
			return page;
		}
		function createTitlePage(){
			var page = createPage();
			page.style.display = 'flex';
			page.style.flexDirection = 'column';
			page.style.flexWrap = 'nowrap';
			page.style.justifyContent = 'center';
			page.style.alignItems = 'center';
			page.style.padding = slides.padding + 'px';
			return page;
		}
		function createContentPage(){
			var page = createPage();
			page.style.display = 'flex';
			page.style.flexDirection = 'column';
			page.style.flexWrap = 'nowrap';
			page.style.justifyContent = 'flex-start';
			page.style.alignItems = 'flex-start';
			page.style.padding = slides.padding + 'px';
			return page;
		}
		function processNotTitle(element){
			// if(element.tagName === undefined){
			// 	var text = Slides.e('span');
			// 	text.innerText = element.nodeValue;
			// 	text.style.textWrap = 'wrap';
			// 	text.style.fontSize = '30px';
			// 	text.style.maxWidth = slides.width - slides.padding*2 + 'px';
			// 	return text;
			// }
			let rElement = false;
			if(!element.processed){
				element.processed = true;
				switch(element.tagName.toLowerCase()){
					case 'code':
						var text = Slides.e('span');
						text.innerText = element.innerText;
						text.setAttribute('text', text.innerText);
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'a':
						var text = Slides.e('a');
						text.innerText = element.innerText;
						text.setAttribute('text', text.innerText);
						text.href = element.href;
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'p':
						var text = Slides.e('p');
						[...element.childNodes].forEach(child => {
							if(child.tagName === undefined){
								var span = Slides.e('span');
								span.innerHTML = child.textContent;
								text.appendChild(child);
							}
							else{
								child = processNotTitle(child);
								text.appendChild(child);
							}
						});
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'pre':
						var text = Slides.e('pre');
						text.innerText = element.innerText;
						text.setAttribute('text', text.innerText);
						text.style.padding = '10px';
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'ul':
					case 'ol':
						var text = Slides.e(element.tagName);
						text.innerHTML = element.innerHTML;
						text.style.padding = '10px';
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'li':
						var text = Slides.e('pre');
						text.innerText = element.parentElement.tagName == 'ol' ? [...element.parentElement.children].indexOf(element) : '*' + ' ' + element.innerText;
						text.setAttribute('text', text.innerText);
						text.style.textWrap = 'wrap';
						text.style.fontSize = '30px';
						text.style.maxWidth = slides.width - slides.padding*2 + 'px';
						rElement = text;
						break;
					case 'table':
						var table = Slides.e('table');
						table.innerHTML = element.innerHTML;
						table.style.fontSize = '30px'
						rElement = table;
						break;
					case 'blockquote':
						var blockquote = Slides.e('div');
						[...element.children].forEach(child => {
							child = processNotTitle(child);
							blockquote.appendChild(child);
						});
						blockquote.style.fontSize = '30px';
						rElement = blockquote;
						break;
					case 'img':
						var image = Slides.e('img');
						image.src = element.src;
						image.style.height = '500px';
						rElement = image;
						break;
					default:
						if(element.children.length > 1){
							var div = Slides.e('div');
							[...element.children].forEach(child => {
								child = processNotTitle(child);
								div.appendChild(child);
							});
							rElement = div;
						}
						else{
							var text = Slides.e('p');
							text.innerText = element.nodeValue || element.innerText;
							text.setAttribute('text', text.innerText);
							text.style.textWrap = 'wrap';
							text.style.fontSize = '30px';
							text.style.maxWidth = slides.width - slides.padding*2 + 'px';
							rElement = text;
							rElement = text;
						}
				}
				if(rElement !== false){
					return rElement;
				}
				else{
					rElement = Slides.e(element.tagName);
					[...element.children].forEach(child => {
						child = processNotTitle(child);
						rElement.appendChild(child);
					});
					// rElement.innerHTML = element.innerHTML;
					return rElement;
				};
			}
		}
		if(element?.indexList?.length && element.indexList.length <= 2 && element.level !== 1e3){
			var page;
			var title = Slides.e('pre');
			title.innerText = element.innerText;
			title.setAttribute('text', title.innerText);
			if(element.indexList.length == 1){
				page = createTitlePage();
				page.className = 'page-title1';
				title.style.fontSize = '100px';
				title.style.width = slides.width - 200 + 'px';
				title.style.textAlign = 'center';
				title.style.textWrap = 'balance';
				title.style.fontWidth = 'bold';
			}
			else{
				page = createContentPage();
				page.className = 'page-title2';
				title.style.fontSize = '70px';
				title.style.width = '100%';
				title.style.textAlign = 'center';
				title.style.textWrap = 'balance';
				title.style.fontWidth = 'bold';
			}
			elementStorage[1] = undefined;
			page.appendChild(title);
			elementStorage[0] = page;
			slides.appendChild(page);
		}
		else{
			switch(element.tagName.toLowerCase()){
				case 'h3':
				case 'h4':
				case 'h5':
				case 'h6':
					var title = Slides.e('pre');
					title.innerText = element.innerText;
					title.setAttribute('text', title.innerText);
					title.style.textWrap = 'balance';
					title.style.fontSize = {h3: 50, h4: 45, h5: 40, h6: 35}[element.tagName.toLowerCase()] + 'px';
					title.style.fontWidth = 'bold';
					let segment = Slides.e('div');
					segment.style.maxWidth = '100%';
					let layerData = contentLayerData;
					if(element?.indexList){
						for(let i of element.indexList){
							layerData = layerData[i].child;
						}
					}
					let childHeightList = [];
					let childList = [];
					document.body.appendChild(title);
					childHeightList.push(title.offsetHeight);
					title.remove();
					childList.push(title);
					segment.appendChild(title);
					for(let childData of layerData){
						var childElement = processNotTitle(childData.element);
						if(childElement){
							document.body.appendChild(childElement);
							childHeightList.push(childElement.offsetHeight);
							childElement.remove();
							childList.push(childElement);
							segment.appendChild(childElement);
						}
					}
					document.body.appendChild(segment);
					var height = segment.offsetHeight;
					segment.remove();
					if(height > slides.height - slides.padding*2){
						let segmentHeight = 0;
						for(let i = 0; i < childHeightList.length; i++){
							var childHeight = childHeightList[i];
							if(elementStorage[0].contentHeight + segmentHeight + childHeight >= slides.height - slides.padding*2){
								elementStorage[0].appendChild(segment);
								var page = createContentPage();
								slides.appendChild(page);
								elementStorage[0] = page;
								segment = Slides.e('div');
								segment.style.maxWidth = '100%';
								segmentHeight = 0;
							}
							segment.appendChild(childList[i]);
							segmentHeight += childHeight;
						}
					}
					else if(elementStorage[0].contentHeight + height >= slides.height - slides.padding*2){
						var page = createContentPage();
						slides.appendChild(page);
						elementStorage[0] = page;
					}
					// elementStorage[0].contentHeight += height;
					elementStorage[1] = undefined;
					elementStorage[0].appendChild(segment);
					break;
				default:
					if(!element.processed){
						if(elementStorage[0] === undefined){
							var page = createContentPage();
							elementStorage[0] = page;
							slides.appendChild(page);
						}
						if(elementStorage[1] === undefined){
							let segment = Slides.e('div');
							segment.style.maxWidth = '100%';
							segment.childList = [];
							segment.childHeightList = [];
							elementStorage[1] = segment;
							elementStorage[0].appendChild(segment);
						}
						let newElement = processNotTitle(element);
						document.body.appendChild(newElement);
						var height = newElement.offsetHeight;
						newElement.remove();
						if(elementStorage[0].contentHeight + elementStorage[1].childHeightList.reduce((t, v) => t + v, 0) + height > slides.height - slides.padding*2){
							var page = createContentPage();
							slides.appendChild(page);
							elementStorage[0] = page;
							let newSegment = Slides.e('div');
							newSegment.style.maxWidth = '100%';
							newSegment.childList = [];
							newSegment.childHeightList = [];
							elementStorage[1] = newSegment;
							elementStorage[0].appendChild(newSegment);
						}
						elementStorage[1].childHeightList.push(height);
						elementStorage[1].childList.push(newElement);
						elementStorage[1].appendChild(newElement);
					}
					break;
			}
		}
	}
}
```