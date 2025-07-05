import "./App.css";

function App() {
	return (
		<main>
			<h2>Collapse</h2>

			<details>
				<summary>Collapse</summary>
				<div>
					<ul>
						<li>Option 1</li>
						<li>Option 2</li>
					</ul>
				</div>
			</details>
			<details>
				<summary>What products do you sell</summary>
				<div>
					<p>We seel the highest quality</p>
				</div>
			</details>

			<h2>Button</h2>

			<div class="flex">
				<button type="button">Outline</button>
				<button type="button" class="primary">
					Primary
				</button>
				<button type="button" class="secondary">
					Secondary
				</button>
				<button disabled type="button">
					Dis Button
				</button>
			</div>

			<h2>Dropdown</h2>

			<div class="flex">
				<details>
					<summary role="button" class="primary">
						Dropdown
					</summary>
					<div role="dialog">
						<ul>
							<li>Option 1</li>
						</ul>
					</div>
				</details>

				<details>
					<summary role="button">Dropdown</summary>
					<div role="dialog">
						<ul>
							<li>Option 1</li>
							<li>Option 2</li>
							<li>
								<a href="#option3">Option here is good 3</a>
							</li>
						</ul>
					</div>
				</details>

				<details>
					<summary role="button" tabIndex={-1} aria-disabled>
						Disabled Dropdown
					</summary>
				</details>
			</div>

			<h2>Tabs</h2>

			<div class="flex">
				<div role="tablist">
					<input
						role="tab"
						type="radio"
						name="my_tabs_1"
						class="tab"
						aria-label="Likes"
					/>
					<input
						role="tab"
						type="radio"
						name="my_tabs_1"
						class="tab"
						aria-label="Followers"
						checked={true}
					/>
					<input
						role="tab"
						type="radio"
						name="my_tabs_1"
						class="tab"
						disabled
						aria-label="Disabled"
					/>
				</div>
			</div>

			<h2>Shadcn Tabs</h2>

			<div class="flex">
				<input type="text" name="name" placeholder="Enter your name" />
				<label role="textbox">
					$
					<input type="number" placeholder="Enter amount" />
				</label>
			</div>

			<div style={{ padding: "4rem" }}></div>
		</main>
	);
}

export default App;
