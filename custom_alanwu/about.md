<!-- don'tParseAsArticle -->
<style>
	/* basic */
	#aboutContent * {
		margin: 0px;
		outline: none;
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
		user-select: none;
	}

	#aboutContent, #glassBox {
		margin: 0px !important;
		width: calc(100*var(--mw)) !important;
    	height: calc(100*var(--mh)) !important;
		position: relative;
	}

	/* settings class */
	#aboutContent [display="bothCenter"] {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}
	#aboutContent [material="glass"] {
		background-color: #ffffff55;
		backdrop-filter: blur(calc(0.4*var(--mw)));
		border-color: #aaaaaa55;
		border-width: 2px;
		border-style: solid;
		border-radius: 20px;
	}

	/* type class */
	#aboutContent .page {
		--margin: calc(4*var(--mw));
		margin: var(--margin) var(--margin) calc(var(--margin)*2) var(--margin);
		width: calc(100*var(--mw) - var(--margin)*2);
		height: calc(100*var(--mh) - var(--margin)*2);
		--pageInnerWidth: 100%;
		--pageInnerHeight: 100%;
	}

	#aboutContent .containBox{
		padding: calc(4*var(--mw));
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	#aboutContent .cardBox {
		gap: calc(4*var(--mw));
		width: 80%;
		width: var(--pageInnerWidth);
		height: calc(var(--pageInnerHeight)/2);
	}
	#aboutContent .cardBox > .card {
		--bgi: url('');
		--shadowColor: black;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: flex-start;
		align-items: center;
		height: 100%;
		width: 100%;
		position: relative;
		background: white;
		border-color: transparent;
		border-color: #afafaf88;
		border-width: 2px;
		border-style: solid;
		border-radius: 15px;
		box-shadow: 0px 0px 0px calc(-1*var(--mw)) white;
		transform: translateY(0px);
		transition: 0.5s;
		transition-timing-function: cubic-bezier(0.6, -0.57, 0.26, 2.12);
		overflow: hidden;
	}
	#aboutContent .cardBox > .card:hover {
		/* border-color: #afafaf88; */
		border-color: var(--shadowColor);
		box-shadow: calc(2*var(--mw)) calc(2*var(--mw)) calc(1*var(--mw)) 0px #00000088;
		transform: translateY(-10px);
		/* box-shadow: 0px 20px 5px 0px var(--shadowColor); */
	}
	#aboutContent .cardBox > .card::before {
		content: "";
		position: absolute;
		--width: calc(12*var(--mw));
		width: var(--width);
		height: var(--width);
		bottom: calc(var(--width)*-0.25);
		right: calc(var(--width)*-0.25);
		z-index: -1;
		background-image: var(--bgi);
		background-position: 0px 0px;
		background-repeat: no-repeat;
		background-size: 100%;
		transform: rotateZ(30deg);
		filter: grayscale(10);
		opacity: 0.2;
		transition: 1s;
	}
	#aboutContent .cardBox > .card:hover::before {
		bottom: calc(1*var(--mw));
		right: calc((100% - var(--width) - 4px)/2);
		transform: rotateZ(0deg);
		filter: grayscale(0);
	}
	#aboutContent .cardBox > .card > h3 {
		margin: calc(2*var(--mw));
		color: black;
		text-align: center;
		font-size: calc(2.2*var(--mw));
		font-weight: bold;
	}
	#aboutContent .cardBox > .card > p {
		margin: calc(3*var(--mw)) calc(2*var(--mw));
		color: black;
		text-align: center;
		font-size: calc(1.2*var(--mw));
		font-weight: bold;
	}

	/* unique element */
	#aboutContent #waterDropCvs {
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 1;
	}

	#aboutContent #pageBox {
		--pageIndex: 0;
		width: 100%;
		height: 100%;
		top: calc(-100*var(--mh) * var(--pageIndex));
		left: 0px;
		transition: 0.5s;
		z-index: 2;
	}

	#aboutContent #title {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: center;
		align-items: center;
		width: var(--pageInnerWidth);
		height: calc(var(--pageInnerHeight)/2);
		color: var(--text-color1);
		text-shadow: calc(2*var(--mw)) calc(2*var(--mw)) calc(1*var(--mw)) #00000088;
		font-size: calc(8*var(--mw));
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
	}

	@media screen and (max-width: 100vh) {
		#aboutContent .cardBox {
			height: calc(var(--pageInnerHeight)*0.8);
			flex-direction: column;
		}
		#aboutContent .cardBox > .card {
			flex-direction: row-reverse;
			justify-content: center;
			align-items: center;
			align-content: center;
			flex-wrap: nowrap;
		}
		#aboutContent .cardBox > .card::before {
			--width: calc(15*var(--mh));
		}
		#aboutContent .cardBox > .card > h3 {
			font-size: calc(6.2*var(--mw));
		}
		#aboutContent .cardBox > .card > p {
			font-size: calc(4.2*var(--mw));
		}

		#aboutContent #title {
			height: calc(var(--pageInnerHeight)*0.2);
		}
	}
</style>
<div id="aboutContent">
	<div id="glassBox" class="page" display="bothCenter" material="glass">
		<div class="containBox">
			<h1 id="title">Websites</h1>
			<div class="cardBox" display="bothCenter">
				<a target="_blank" class="card hrefButton" style="--shadowColor: #ff7e7e; --bgi: url('<?=basicPath?>/image/aboutImage/logo-youtube.png');" href="https://www.youtube.com/channel/UCSc8KKDgxmsa5xwY7FjEI0w">
					<h3>YouTube</h3>
					<p contentkey="youtube-description">Alanwu的主頻道，<br>以音遊影片為主。</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #666666; --bgi: url('<?=basicPath?>/image/aboutImage/logo-github.png');" href="https://github.com/alanwu-9582">
					<h3>Github</h3>
					<p contentkey="github-description">各種奇怪專案<br>堆放處。</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #b29bff; --bgi: url('<?=basicPath?>/image/aboutImage/logo-twitch.png');" href="https://www.twitch.tv/xxooalanxdooxx">
					<h3>Twitch</h3>
					<p contentkey="twitch-description">會不會哪天突然開台呢？<br>按下追隨不就知道了。</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #666666; --bgi: url('<?=basicPath?>/image/aboutImage/logo-twitter.png');" href="https://twitter.com/XxAlanXDxX">
					<h3>Twitter</h3>
					<p contentkey="twitter-description">用ID來預測<br>馬斯克的行動。</p>
				</a>
			</div>
		</div>
	</div>
</div>