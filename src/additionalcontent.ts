declare let jQuery: any;
declare let $: any;
declare let window: any;

let current_lang: string = "en";

export function currentLang(): string {
  return current_lang;
}

export function init(lang?: string) {
  if (!lang || (lang != "en" && lang != "ja")) lang = "en";
  current_lang = lang;

  $(function () {
    let playground = $("#playground-content");
    let note = $("#additional-content");
    let noteBody = $("#additional-content-body");
    let toggleBtn = $("#playground-toggler");
    let toggleBtnIcon = $("#playground-toggler").find("i");
    let toggleAnchor = $(".toggle-tensorflowplayground");
    let langButton = $("#lang-selection button");
    let additionalContentBody = $('#additional-content-body');

    playground.css("visibility", "visible").css("display", "none");
    switchLanguage(lang);
  
    /***
     * Shows/Hides TensorFlow Playground
     * @param e {Event} eventHandler for click event
     */
    function toggleTensorFlowPlayground(e: Event) {
      if (!playground.is(":visible")) {
        note.addClass("pushback");
        noteBody.addClass("hide");
      }

      playground.toggle("slide", {
        direction: "down"
      },
        function () {
          if (playground.is(":visible")) {
            $("#header-bar").removeClass("playground-hidden");
            toggleBtnIcon.text("expand_more");
            
            try{
              window.dispatchEvent(new Event('resize'));
            }
            catch(e){
              // Todo: Find and write alternative code in case 'dispatchEvent' does not work.
            }
          }
          else {
            $("#header-bar").addClass("playground-hidden");
            toggleBtnIcon.text("videogame_asset");
            note.removeClass("pushback");
            noteBody.removeClass("hide");
          }
        }
      );
    }
  
    // Bind click event which controls visibility of playground content
    toggleBtn.on("click", toggleTensorFlowPlayground);
    toggleAnchor.on("click", function (e: Event) {
      e.preventDefault();
      e.stopPropagation();
      toggleTensorFlowPlayground(e);
    });
  
    /// Change current language in whole site content
    langButton.on("click", function (e) {
      let selected_lang = $(this).data("lang");
      if (selected_lang == current_lang) return;

      current_lang = selected_lang;
      switchLanguage(selected_lang);
    });
  
    /// Popup picture depicting backpropagation
    let backprop_img = $('#img-backprop');
    let pinned = false;
    $('#img-backprop').on('click', function(){
      if(!pinned){
        let right = window.innerWidth - (additionalContentBody.offset().left + additionalContentBody.width());
        backprop_img.css({
          "display": "block",
          "position": "fixed",
          "top": 80,
          "right": right,
          "width": 700,
          "border": "1px solid gray",
          "z-index": "1000",
          "padding": "0"
        });
      }
      else{
        backprop_img.css({
          "display": '',
          "position": '',
          "top": '',
          "right": '',
          "width": '',
          "border": '',
          "z-index": '',
          "padding": "10px"
        });
      }
      
      pinned = !pinned;
    });
  
    /// Popup picture depicting backpropagation
    let regularization_img = $('#img-regularization');
    let reg_pinned = false;
    regularization_img.on('click', function(){
      if(!reg_pinned){
        let right = window.innerWidth - (additionalContentBody.offset().left + additionalContentBody.width());
        regularization_img.css({
          "display": "block",
          "position": "fixed",
          "top": 80,
          "right": right,
          "width": 400,
          "border": "1px solid gray",
          "z-index": "1000",
          "padding": "0"
        });
      }
      else{
        regularization_img.css({
          "display": '',
          "position": '',
          "top": '',
          "right": '',
          "width": '',
          "border": '',
          "z-index": '',
          "padding": "10px"
        });
      }
  
      reg_pinned = !reg_pinned;
    });
  
    $("#switch-theme").prop("checked", false);
    $(".header-logo-invertocat").find("svg").attr("fill", "rgba(0, 0, 0, 0.7)");
    $("#switch-theme").on("change", function(e){
      if($(this).prop("checked")){
        $("body").removeClass("white");
        $(".header-logo-invertocat").find("svg").attr("fill", "rgba(255, 255, 255, 0.7)");
      }
      else{
        $("body").addClass("white");
        $(".header-logo-invertocat").find("svg").attr("fill", "rgba(0, 0, 0, 0.7)");
      }
    });
    
    // Add menu index
    let noteBodyLeft: Function = function(){
      return noteBody.offset().left + noteBody.outerWidth(false)
    };
    let indexArea = $("<div>");
    indexArea.prop("id", "index-part");
    indexArea.css({
      "position": "fixed",
      "top": noteBody.offset().top,
      "left": noteBodyLeft() + 20,
      "right": 20
    });
    $("[data-title]").each(function(i, elem){
      let $elem = $(elem);
      let title = $elem.text();
      let url = "#" + $elem.prop("id");
      let pager = $("<div>");
      pager.addClass("pager");
      
      let data_title = $(elem).data("title");
      if(typeof data_title == "string" && data_title.length > 0){
        title = data_title;
      }
  
      pager.html("<a href='" + url + "'>" + title + "</a>");
      indexArea.append(pager);
    });
    noteBody.append(indexArea);
    
    if($(window).width() - noteBodyLeft() < 140){
      indexArea.css("display", "none");
    }
    
    $(window).resize(function(){
      indexArea.css({"left": noteBodyLeft() + 20});
      if($(window).width() - noteBodyLeft() < 140){
        indexArea.css("display", "none");
      }
      else if(indexArea.css("display") == "none") {
        indexArea.css("display", "");
      }
    });
  });
}

function switchLanguage(lang: string) {
  if (lang != "ja" && lang != "en") return;

  let textpart_en = $("#additional-content-body .text-content[data-lang='en']");
  let textpart_ja = $("#additional-content-body .text-content[data-lang='ja']");

  if (lang == "en") {
    $("[data-i18n='toggleplaygroundvisibility']").text("Click this button to toggle playground visible/hidden.");
    $("[data-i18n='togglecolortheme']").text("You can switch theme color of this website");
    $("[data-i18n='headertitle']").html("Tinker With a <b>Neural Network</b> <span class=\"optional\">Right Here </span>in Your Browser.<br>Don’t Worry, You Can’t Break It. We Promise.");
    $("[data-i18n='iterations']").text("Iterations");
    $("[data-i18n='learnmingrate']").text("Learning rate");
    $("[data-i18n='activation']").text("Activation");
    $("[data-i18n='sigmoid']").text("Sigmoid");
    $("[data-i18n='linear']").text("Linear");
    $("[data-i18n='regularization']").text("Regularization");
    $("[data-i18n='regularizationrate']").text("Regularization rate");
    $("[data-i18n='problemtype']").text("Problem type");
    $("[data-i18n='classification']").text("Classification");
    $("[data-i18n='regression']").text("Regression");
    $("[data-i18n='data']").text("Data");
    $("[data-i18n='whichdataset']").text("Which dataset do you want to use?");
    $("[data-i18n='circle']").attr("title", "Circle");
    $("[data-i18n='exclusiveor']").attr("title", "Exclusive or");
    $("[data-i18n='gaussian']").attr("title", "Gaussian");
    $("[data-i18n='spiral']").attr("title", "Spiral");
    $("[data-i18n='plane']").attr("title", "Plane");
    $("[data-i18n='multigaussian']").attr("title", "Multi gaussian");
    $("[data-i18n='rationoftrainingdata']").text("Ratio of training to test data:");
    $("[data-i18n='noise']").text("Noise:");
    $("[data-i18n='batchsize']").text("Batch size:");
    $("[data-i18n='regen']").text("Regenerate");
    $("[data-i18n='regen']").attr("title", "Regenerate data");
    $("[data-i18n='features']").text("Features");
    $("[data-i18n='whichproperty']").text("Which properties do you want to feed in?");
    $("[data-i18n='clickanywheretoedit']").text("Click anywhere to edit.");
    $("[data-i18n='thumbnaillabel']").html("This is the output from one <b>neuron</b>. Hover to see it larger.");
    $("[data-i18n='weightslabel']").html("The outputs are mixed with varying <b>weights</b>, shown by the thickness of the lines.");
    if ($("#num-layers").text() == "1") $("[data-i18n='layerslabel']").text("Hidden layer");
    if ($("#num-layers").text() != "1") $("[data-i18n='layerslabel']").text("Hidden layers");
    $("[data-i18n='output']").text("Output");
    $("[data-i18n='testloss']").text("Test loss");
    $("[data-i18n='trainingloss']").text("Training loss");
    $("[data-i18n='colorsshowsdata']").text(" Colors shows data, neuron and weight values.");
    $("[data-i18n='showtestdata']").text("Show test data");
    $("[data-i18n='discretizeoutput']").text("Discretize output");

    textpart_en.removeClass("hide");
    textpart_ja.addClass("hide");
  }
  else if (lang == "ja") {
    $("[data-i18n='toggleplaygroundvisibility']").text("デモの非表示/表示を切り替えられます。");
    $("[data-i18n='togglecolortheme']").text("サイトのテーマカラーを切り替えられます。");
    $("[data-i18n='headertitle']").html("<span class=\"optional\">ブラウザ上で</span><b>ニューラルネットワーク</b>のメカニズムを検証してみよう。<br>何も壊れないから心配はいらない。");
    $("[data-i18n='iterations']").text("エポック");
    $("[data-i18n='learnmingrate']").text("学習率");
    $("[data-i18n='activation']").text("活性化関数");
    $("[data-i18n='sigmoid']").text("シグモイド関数");
    $("[data-i18n='linear']").text("線形関数");
    $("[data-i18n='regularization']").text("正則化");
    $("[data-i18n='regularizationrate']").text("正則化項");
    $("[data-i18n='problemtype']").text("統計モデルの種類");
    $("[data-i18n='classification']").text("分類");
    $("[data-i18n='regression']").text("回帰");
    $("[data-i18n='data']").text("データ");
    $("[data-i18n='whichdataset']").text("どのデータセットを使いますか?");
    $("[data-i18n='circle']").attr("title", "円");
    $("[data-i18n='exclusiveor']").attr("title", "排他OR");
    $("[data-i18n='gaussian']").attr("title", "ガウシアン");
    $("[data-i18n='spiral']").attr("title", "螺旋");
    $("[data-i18n='plane']").attr("title", "平面");
    $("[data-i18n='multigaussian']").attr("title", "マルチガウシアン");
    $("[data-i18n='rationoftrainingdata']").text("トレーニングデータの割合:");
    $("[data-i18n='noise']").text("ノイズ:");
    $("[data-i18n='batchsize']").text("バッチサイズ:");
    $("[data-i18n='regen']").text("再生成");
    $("[data-i18n='regen']").attr("title", "データを再生成する");
    $("[data-i18n='features']").text("特徴");
    $("[data-i18n='whichproperty']").text("入力するデータの特徴を選択してください");
    $("[data-i18n='clickanywheretoedit']").text("クリックして値を編集");
    $("[data-i18n='thumbnaillabel']").html("この<b>ニューロン</b>の出力です。マウスオーバーすると拡大して見れます。");
    $("[data-i18n='weightslabel']").html("ニューロンの出力は<b>重み</b>の影響を受けます。重みは線の太さと色で表されます。");
    let numLayers: number = +$("#num-layers").text();
    if (numLayers == 0 || numLayers >= 10) {
      $("[data-i18n='layerslabel']").text("個の隠し層");
    }
    else {
      $("[data-i18n='layerslabel']").text("つの隠し層");
    }
    $("[data-i18n='output']").text("出力");
    $("[data-i18n='testloss']").text("誤差(テスト)");
    $("[data-i18n='trainingloss']").text("誤差(トレーニング)");
    $("[data-i18n='colorsshowsdata']").text("データやニューロン、重みの値は色で表現されます。");
    $("[data-i18n='showtestdata']").text("テストデータを表示する");
    $("[data-i18n='discretizeoutput']").text("出力を離散化する");

    textpart_en.addClass("hide");
    textpart_ja.removeClass("hide");
  }
}
