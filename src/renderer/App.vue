<template>
    <div id="app">
        <div class="ui vertical center aligned segment" style="border-bottom:0">
            <div class="ui container">
                <div class="ui inverted borderless large pointing menu" style="opacity:0">

                </div>
            </div>
        </div>
        <div class="ui container">
            <div class="ui grid" @keyup="update_current" @change="update_current">
                <div class="row">
                    <div class="sixteen wide column">
                        <h2 class="ui header padding top">CUP Online Judge Problem Creator</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <button class="ui primary button" @click="load">Load Problem</button>
                        <a class="ui button" @click="add_problem">
                            <i class="plus icon"></i>
                            Add Problem
                        </a>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui buttons">
                            <a @click="show_problem(index)"
                               :class="'ui primary basic button '+(current_tag === index-1?'active':'')"
                               v-for="index in Array.from(Array(problem_list.length ? problem_list.length : Object.values(problem_list).length).keys())">{{(index
                                ===
                                current_tag?title?title:'New Problem':index)}}</a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Title
                            </div>
                            <input type="text" v-model="title" title=""></div>
                    </div>
                </div>
                <div class="row">
                    <div class="eight wide column">
                        <div :class="'ui labeled input '+(isNaN(time)?'error':'')">
                            <div class="ui label">
                                Time(s)
                            </div>
                            <input type="text" v-model="time" title=""></div>
                    </div>
                    <div class="eight wide column">
                        <div :class="'ui labeled input '+(isNaN(memory)?'error':'')">
                            <div class="ui label">
                                Memory(MB)
                            </div>
                            <input title="" type="text" v-model="memory"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Source
                            </div>
                            <input title="" type="text" v-model="source"></div>
                    </div>
                    <div class="eight wide column">
                        <div class="ui labeled input">
                            <div class="ui label">
                                Label
                            </div>
                            <input title="" type="text" v-model="label"></div>
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
                        <div class="ui warning message">
                            <div class="header">
                                Important
                            </div>
                            <div class="content">
                                <p>You must upload at least one Input file even it is just empty file.<br>
                                    A problem with 0 Input file will always return "Accept" when user submit their
                                    code.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column">
                        <div class="ui blue labels">
                            <a class="ui label" v-for="item in input_files">
                                {{typeof item === 'object' ? item.name : require('path').basename(item)}}
                                <i class="icon close" @click="deleteFile(item,'inputfile')"></i>
                            </a>
                            <a class="ui label" v-for="item in output_files">
                                {{typeof item === 'object' ? item.name : require('path').basename(item)}}
                                <i class="icon close" @click="deleteFile(item,'outputfile')"></i>
                            </a>
                            <a class="ui label" v-for="item in prepend">
                                {{typeof item === 'object' ? item.name : require('path').basename(item)}}
                                <i class="icon close" @click="deleteFile(item,'prependfile')"></i>
                            </a>
                            <a class="ui label" v-for="item in append">
                                {{typeof item === 'object' ? item.name : require('path').basename(item)}}
                                <i class="icon close" @click="deleteFile(item,'appendfile')"></i>
                            </a>
                            <a class="ui label" v-for="item in solution">
                                {{typeof item === 'object' ? item.name : require('path').basename(item)}}
                                <i class="icon close" @click="deleteFile(item,'solution')"></i>
                            </a>
                            <a class="ui label" v-if="spj && spj.length && spj.length > 0">
                                {{typeof spj === 'object' ? spj.name : require('path').basename(spj)}}
                            </a>
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
  /* eslint-disable indent,no-tabs,no-mixed-spaces-and-tabs */
  import bluebird from "bluebird";
  import _fs from "fs";
  import zlib from "zlib";
  import path from "path";

  const fs = bluebird.promisifyAll(_fs);

  function packToArray () {
    if (arguments.length > 0) {
      let cbArray = [];
      for (let i of arguments) {
        if (i && typeof i !== "string" && i.length && i.length > 0) {
          cbArray.push(i);
        }
        else {
          cbArray.push([i]);
        }
      }
      return cbArray;
    }
    else {
      return [];
    }
  }

  function saveToFile (file_path, ...files) {
    for (let i of files) {
      if (typeof i !== "string" && i && i.length) {
        for (let j of i) {
          fs.writeFileSync(`${path}/${j.name}`, j.content);
        }
      }
    }
  }

  export default {
    name: "CUP_Online_Judge_Problem_Creator",
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
        solution: [],
        spj: "",
        problem_list: {0: {}, length: 1},
        current_tag: 0
      };
    },
    methods: {
      save_current: function () {
        this.problem_list[this.current_tag] = {
          title: this.title,
          time: this.time,
          memory: this.memory,
          source: this.source,
          description: this.description,
          input: this.input,
          output: this.output,
          label: this.label,
          sample_input: this.sample_input,
          sample_output: this.sample_output,
          hint: this.hint,
          input_files: this.input_files,
          output_files: this.output_files,
          prepend: this.prepend,
          append: this.append,
          solution: this.solution,
          spj: this.spj
        };
        // console.log(this.problem_list)
        Object.assign(this, this.problem_list[this.current_tag]);
      },
      clear_current: function () {
        this.title = this.source = this.description = this.input = this.output = this.label =
          this.sample_input = this.sample_output = this.hint = this.spj = "";
        this.time = this.memory = 0;
        this.input_files = [];
        this.output_files = [];
        this.prepend = [];
        this.append = [];
        this.solution = [];
      },
      add_problem: function () {
        this.save_current();
        this.problem_list[(this.current_tag = this.problem_list.length++)] = {};
        this.clear_current();
      },
      update_current: function () {
        this.save_current();
      },
      show_problem: function (index) {
        const t = this.problem_list[index];
        this.current_tag = index;
        Object.assign(this, {
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
          solution: [],
          spj: ""
        });
        Object.assign(this, t);
      },
      load: function () {
        this.$electron.ipcRenderer.send("open-file-dialog");
      },
      save_test_file: function () {
        this.$electron.ipcRenderer.send("open-file-dialog");
      },
      deleteFile: function (file, type) {
        const target = {
          inputfile: this.input_files,
          outputfile: this.output_files,
          prependfile: this.prepend,
          appendfile: this.append,
          spj: this.spj,
          solution: this.solution
        };
        if (typeof file === "object") {
          if (type === "spj") {
            this.spj = "";
          } else {
            let pos = -1;
            for (let i in target[type]) {
              if (target[type][i].name === file) {
                pos = i;
                break;
              }
            }
            target[type].splice(pos, 1);
          }
        } else {
          let pos = target[type].indexOf(file);
          if (pos !== -1) {
            target[type].splice(pos, 1);
          }
        }
      },
      readFile: async (source) => {
        let target = [];
        for (let i of source) {
          if (typeof i === "string") {
            const content = await fs.readFileAsync(i);
            const name = path.basename(i);
            target.push({
              name: name,
              content: content.toString("base64")
            });
          } else {
            target.push(i);
          }
        }
        return target;
      },
      pack: function () {
        this.save_current();
        this.$electron.ipcRenderer.send("open-save-file-dialog");
      }
    },
    mounted: function () {
      console.log(this.$data);
      const that = this;
      const holder = document.getElementById("upload_file");
      holder.ondragover = function () {
        document.getElementById("message").innerText = "Release your mouse to upload";
        return false;
      };
      holder.ondragleave = holder.ondragend = function () {
        document.getElementById("message").innerText = "Drag your files and drop them here";
        return false;
      };
      holder.ondrop = function (e) {
        e.preventDefault();
        for (let i = 0; i < e.dataTransfer.files.length; ++i) {
          const _path = e.dataTransfer.files[i].path;
          if (_path.lastIndexOf(".in") === _path.length - 3 && that.input_files.indexOf(_path) === -1) {
            that.input_files.push(_path);
          } else if (_path.lastIndexOf(".out") === _path.length - 4 && that.output_files.indexOf(_path) === -1) {
            that.output_files.push(_path);
          } else if (_path.indexOf("prepend") !== -1 && _path.lastIndexOf(".") !== _path.length - 1 && that.prepend.indexOf(_path) === -1) {
            that.prepend.push(_path);
          } else if (_path.indexOf("append") !== -1 && _path.lastIndexOf(".") !== _path.length - 1 && that.append.indexOf(_path) === -1) {
            that.append.push(_path);
          } else if (_path.indexOf("spj") !== -1) {
            that.spj = _path;
          } else if (_path.indexOf("solution") !== -1) {
            that.solution.push(_path);
          }
        }
        return false;
      };
      const _that = this;
      this.$electron.ipcRenderer.on("selected-directory", async (event, _path) => {
        let inputFiles = [];
        let outputFiles = [];
        let prependFiles = [];
        let appendFiles = [];
        let solutionFiles = [];
        let spj;
        const readFile = this.readFile;

        let result = [];
        for (let i = 0; i < _that.problem_list.length; ++i) {
          const that = _that.problem_list[i];
          const tmp = await (async () => {
            console.log(that);
            [inputFiles, outputFiles, prependFiles, appendFiles, solutionFiles] = await Promise.all([
              readFile(that.input_files), readFile(that.output_files), readFile(that.prepend),
              readFile(that.append), readFile(that.solution)
            ]);
            if (typeof that.spj === "string" && that.spj.length > 0) {
              const content = await fs.readFileAsync(that.spj);
              const name = path.basename(that.spj);
              spj = {
                name: name,
                content: content
              };
            }
            return {
              title: that.title,
              label: that.label ? that.label.split(" ") : [],
              time: parseFloat(that.time),
              memory: parseInt(that.memory),
              description: that.description,
              input: that.input,
              output: that.output,
              sample_input: that.sample_input,
              sample_output: that.sample_output,
              hint: that.hint,
              source: that.source,
              input_files: inputFiles,
              output_files: outputFiles,
              prepend_files: prependFiles,
              append_files: appendFiles,
              solution: solutionFiles,
              special_judge: spj
            };
          })();
          result.push(tmp);
        }
        console.log(JSON.stringify(result));
        zlib.gzip(JSON.stringify(result), async (err, result) => {
          if (err) {
            console.log(err);
          }
          await fs.writeFileAsync(path.join(_path[0], "problem.rpk"), result, () => {

          });
          this.$electron.remote.dialog.showMessageBox({
            type: "none",
            message: "Problem.rpk has been generated!"
          });
        });
      });
      this.$electron.ipcRenderer.on("selected-export-directory", async (event, export_path) => {
        let input_file = this.input_files,
          output_file = this.output_files,
          prependfile = this.prepend_files,
          appendfile = this.append_files,
          spj = this.spj,
          solution = this.solution;
        const readFile = this.readFile;
        [input_file, output_file, prependfile, appendfile, spj, solution] = packToArray(input_file, output_file,
          prependfile, appendfile, spj, solution);
        [input_file, output_file, prependfile, appendfile, spj, solution] = await Promise.all([
          readFile(input_file), readFile(output_file), readFile(prependfile), readFile(appendfile),
          readFile(spj), readFile(solution)
        ]);
        saveToFile(export_path, input_file, output_file, prependfile, appendfile, spj, solution);
      });
      this.$electron.ipcRenderer.on("selected-file", async (event, _path) => {
        const fileName = _path[0];
        const buffer = await fs.readFileAsync(fileName);
        const unzipData = await new Promise(resolve => {
          zlib.gunzip(buffer, (err, result) => {
            if (err) {
              console.log(err);
            }
            resolve(result.toString());
          });
        });
        const _data = JSON.parse(unzipData);
        let _problemList = {length: _data.length};
        let cnt = 0;
        // console.log(_data)
        try {
          for (let data of _data) {
            console.log(data);
            let that = {};
            that.title = data.title;
            that.time = data.time;
            that.memory = data.memory;
            that.label = typeof data.label === "object" && data.label.length > 0 ? data.label.join(" ") : "";
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
            that.solution = data.solution;
            _problemList[cnt++] = that;
          }
        } catch (e) {
          console.log(e);
        }
        _problemList.length = cnt;
        _that.problem_list = _problemList;
        _that.current_tag = 0;
        Object.assign(_that, _problemList[0]);
      });
    }
  };
</script>

<style>
    /* CSS */
</style>
