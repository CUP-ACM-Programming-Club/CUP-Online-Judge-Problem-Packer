<template>
    <div id="app">
        <div class="ui container">
            <div class="ui grid">
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui header padding top">CUP Online Judge Problem Creator</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <button class="ui primary button" @click="load">Load Problem</button>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Title
                            </div>
                            <input type="text" v-model="title"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Time
                            </div>
                            <input type="text" v-model="time"></div>
                    </div>
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Memory
                            </div>
                            <input type="text" v-model="memory"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Source
                            </div>
                            <input type="text" v-model="source"></div>
                    </div>
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Label
                            </div>
                            <input type="text" v-model="label"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Description</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="description"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Input</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="input"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Output</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="output"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Sample Input</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="sample_input"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Sample Output</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="sample_output"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">Hint</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <mavon-editor v-model="hint"/>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui dividing header">
                            Upload Files
                        </h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui message">
                            <div class="header">
                                You should upload:
                            </div>
                            <ul class="list">
                                <li>Input files (end with suffix ".in")</li>
                                <li>Output files (end with suffix ".out")</li>
                                <li>Prepend files (named "prepend.[language]" i.e. "prepend.cpp")</li>
                                <li>Append files (named "append.[language]" i.e. "append.cpp")</li>
                                <li>Special Judge files (named "spj.[language]" i.e. "spj.js")</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui grey inverted vertical masthead center aligned segment" id="upload_file">
                            <h2></h2>
                            <p id="message">Drag your files and drop them here</p>
                            <h2></h2>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <button class="ui primary button" @click="pack">Generate Problem</button>
                    </div>
                </div>
                <h2></h2>
            </div>
            <!--<router-view></router-view>-->
        </div>
        <div class="ui inverted vertical footer segment"></div>
    </div>
</template>

<script>
	export default {
		name: 'electron_vue_project',
		data: function () {
			return {
				title: "",
				time: 0,
				memory: 0,
				source: "",
				description: "",
				input: "",
				output: "",
				label: "",
				sample_input: "",
				sample_output: "",
				hint: "",
				input_files: [],
				output_files: [],
				prepend: [],
				append: [],
				spj: []
			};
		},
		methods: {
			load: function (e) {
				const that = this;
				const fs = require("bluebird").promisifyAll(require("fs"));
				const zlib = require("zlib");
				this.$electron.ipcRenderer.send("open-file-dialog");
				this.$electron.ipcRenderer.on("selected-file", async (event, _path) => {
					const _file_name = _path[0];
					if(_file_name.lastIndexOf(".rspk") !== -1) {
						const buffer = await fs.readFileAsync(_path[0]);
						const unzip_data = await new Promise((resolve,reject)=>{
							zlib.gunzip(buffer,(err,result)=>{
								resolve(result.toString());
							})
						})
						const data = JSON.parse(unzip_data);
						that.title = data.title;
						that.time = data.time;
						that.memory = data.memory;
						that.label = data.label.join(" ");
						that.description = data.description;
						that.input = data.input;
						that.output = data.output;
						that.sample_input = data.sample_input;
						that.sample_output = data.sample_output;
						that.hint = data.hint;
						that.input_files = data.input_files;
						that.output_files = data.output_files;
						that.prepend = data.prepend_files;
						that.append = data.append_files;
						that.spj = data.special_judge;
					}
				})
			},
			pack: function (e) {
				const that = this;
				const fs = require("bluebird").promisifyAll(require("fs"));
				this.$electron.ipcRenderer.send("open-save-file-dialog");
				this.$electron.ipcRenderer.on("selected-directory", (event, _path) => {
					let input_files = [];
					let output_files = [];
					let prepend_files = [];
					let append_files = [];
					let spj;

					const readFile = async (source,target)=>{
						for (let i of source) {
							if(typeof i === "string") {
								const content = await fs.readFileAsync(i);
								const name = path.basename(i);
								target.push({
									name: name,
									content: content
								});
							}
							else{
								target.push(i);
                            }
						}
                    }
					(async () => {
						readFile(that.input_files,input_files);
						readFile(that.output_files,output_files);
						readFile(that.prepend,prepend_files);
						readFile(that.append,append_files);
						if (typeof that.spj === "string" && that.spj.length > 0) {
							const content = await fs.readFileAsync(that.spj);
							const name = path.basename(that.spj);
							spj = {
								name: name,
								content: content
							}
						}

						const target = {
							title: that.title,
							label: that.label ? that.label.split(" ") : "",
							time: parseFloat(that.time),
							memory: parseInt(that.memory),
							description: that.description,
							input: that.input,
							output: that.output,
							sample_input: that.sample_input,
							sample_output: that.sample_output,
							hint: that.hint,
							source: that.source,
							input_files: input_files,
							output_files: output_files,
							prepend_files: prepend_files,
							append_files: append_files,
							special_judge: spj
						};
						zlib.gzip(JSON.stringify(target), async (err, result) => {
							await fs.writeFileAsync(path.join(_path[0], "problem.rspk"), result, () => {
							})
							return;
						})
						return;
					})();
				})
			}
		},
		mounted: function () {
			console.log(this.$data);
			const that = this;
			const holder = document.getElementById('upload_file');
			holder.ondragover = function (e) {
				document.getElementById("message").innerText = "Release your mouse to upload";
				return false;
			};
			holder.ondragleave = holder.ondragend = function (e) {
				document.getElementById("message").innerText = "Drag your files and drop them here";
				return false;
			};
			holder.ondrop = function (e) {
				e.preventDefault();
				const message = document.getElementById("message");
				for (let i = 0; i < e.dataTransfer.files.length; ++i) {
					const _path = e.dataTransfer.files[i].path;
					if (_path.lastIndexOf(".in") === _path.length - 3 && that.input_files.indexOf(_path) === -1) {
						that.input_files.push(_path);
					}
					else if (_path.lastIndexOf(".out") === _path.length - 4 && that.output_files.indexOf(_path) === -1) {
						that.output_files.push(_path);
					}
					else if (_path.indexOf("prepend") !== -1 && _path.lastIndexOf(".") !== _path.length - 1 && that.prepend.indexOf(_path) === -1) {
						that.prepend.push(_path);
					}
					else if (_path.indexOf("append") !== -1 && _path.lastIndexOf(".") !== _path.length - 1 && that.append.indexOf(_path) === -1) {
						that.append.push(_path);
					}
					else if (_path.indexOf("spj") !== -1) {
						that.spj = _path;
					}
					console.log(that);
				}
				message.innerHTML = "Input files:<br>";
				for (let i of that.input_files) {
					message.innerHTML += `${i}<br>`;
				}
				message.innerHTML += "Output files:<br>";
				for (let i of that.output_files) {
					message.innerHTML += `${i}<br>`;
				}
				message.innerHTML += "Prepend files:<br>";
				for (let i of that.prepend) {
					message.innerHTML += `${i}<br>`;
				}
				message.innerHTML += "Append files:<br>";
				for (let i of that.append) {
					message.innerHTML += `${i}<br>`;
				}
				message.innerHTML += "Special Judge files:<br>";
				message.innerHTML += `${that.spj}<br>`;
				return false;
			};
		}
	}
</script>

<style>
    .padding.top {
        padding-top: 1em;
    }

    /* CSS */
</style>
