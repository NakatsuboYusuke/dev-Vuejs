// コンポーネントの定義
Vue.component('my-component', {
  template: '<p>MyComponet</p>'
})

var myComponet = {
  template: '<p>MyComponet</p>'
}
// コンポーネントはインスタンスが作成される前に定義する
var app = new Vue({
  el: '#app',
  components: {
    'my-component': myComponet
  }
})

var myComponet = Vue.component('my-component', {
  template: '<p>{{ message }}</p>',
  data: function() {
    return {
      message: 'Hello, World'
    }
  },
  methods: {
    // 処理を記述する
  }
})
var app = new Vue({
  el: '#app',
  components: {
    'my-component': myComponet
  }
})
=> 実行結果
<div id="app"><p>Hello, World</p></div>

template: <span>Hello</span><span>, World</span>
// => NG
template: <div><span>Hello</span><span>, World</span></div>
// => OK

{/* <div id="app">
  <my-component></my-component>
  // ↑と↓は別々のインスタンスでそれぞれスコープをもつ
  <my-component></my-component>
</div> */}

// コンポーネント間の通信
Vue.component('my-component', {
  template: '<p><component-child>MyComponet</component-child></p>'
})
// 親がルートインスタンスの場合
var componentChild = Vue.component('component-child', {
  template: '<p>{{ val }}</p>',
  props: ['val']
})
var app = new Vue({
  el: '#app',
  // components: {
  //   'component-child': componentChild
  // }
})

// 親から子へリアクティブデータを渡す
var componentChild = Vue.component('component-child', {
  template: '<p>{{ val }}</p>',
  props: ['val']
})
var app = new Vue({
  el: '#app',
  data: {
    valA: 'これは子A',
    valB: 'これは子B'
  }
})

// 子コンポーネントに属性を渡す
var componentChild = Vue.component('component-child', {
  template: '<p id="child" class="child">componentChild</p>',
})
var app = new Vue({
  el: '#app'
})

Vue.component('component-child', {
  template: '<p id="child" class="child">componentChild</p>',
})
new Vue({
  el: '#app'
})

子コンポーネントでfor文を使う
Vue.component('component-child', {
  template: '<li>{{ name }} HP.{{ hp }}</li>',
  props: [
    'name',
    'hp'
  ]
})
new Vue({
  el: '#app',
  data: {
    list: [
      { id: 1, name: 'スライム', hp: 100},
      { id: 2, name: 'ゴブリン', hp: 200},
      { id: 3, name: 'ドラゴン', hp: 500}
    ]
  }
})


// 子コンポーネントはpropsで受け取ったデータを書き換えてはいけない
Vue.component('component-child', {
  template: '<li>{{ name }} HP.{{ hp }}\
            <button v-on:click="doAttack">攻撃する</button></li>',
  props: [
    'name',
    'hp'
  ],
  methods: {
    doAttack: function() {
      this.hp -= 10
    }
  }
})
new Vue({
  el: '#app',
  data: {
    list: [
      { id: 1, name: 'スライム', hp: 100},
      { id: 2, name: 'ゴブリン', hp: 200},
      { id: 3, name: 'ドラゴン', hp: 500}
    ]
  }
})
// => [Vue warn]: ~

// propsの受け取りデータ型を指定する
Vue.component('component-child', {
  props: {
    val: String
  }
})
// 1 + '1' => 11 :String
// propsの許容範囲はしっかり定義しておく

Vue.component('example', {
  props: {
    // Nullはどんなデータ型も受け取る
    propA: Number,
    propB: [String, Number],
    propC: {
      type: String,
      required: true
    },
    // デフォルト値
    propD: {
      type: Number,
      dafault: 100
    },
    propE: {
      type: Object,
      default: function() {
        return { message: 'hello' }
      }
    },
    // カスタムでバリデーションを設定
    propF: {
      validator: function(value) {
        return value > 10
      }
    }
  }
})
// => propsに記述するとコードの見通しが悪くなるので、属性に記述した方がスマート
// => <component-child v-bind="object"></component-child>

子から親へデータを渡す
Vue.component('component-child', {
  template: '<button v-on:click="handleClick">イベント発火</button>',
  methods: {
    handleClick: function() {
      this.$emit('childs-event')
    }
  }
})
new Vue({
  el: '#app',
  methods: {
    parentsMethod: function() {
      alert('イベントをキャッチ')
    }
  }
})

Vue.component('component-child',{
  template: '<li>{{ name }} HP.{{ hp }}\
            <button v-on:click="doAttack">攻撃する</button></li>',
  // props の受け取りデータ型を指定
  props: {
    id: Number,
    name: String,
    hp: Number
  },
  methods: {
    doAttack: function() {
      this.$emit('attack', this.id)
    }
  }
})
new Vue({
  el: '#app',
  data: {
    // データは親に持たせておく
    list: [
      { id: 1, name: 'スライム', hp: 100},
      { id: 2, name: 'ゴブリン', hp: 200},
      { id: 3, name: 'ドラゴン', hp: 500}
    ]
  },
  methods: {
    handleAttack: function(id) {
      // 引数のIDから要素を検索
      var item = this.list.find(function(el) {
        return el.id === id
      })
      if (item.hp !== undefined && item.hp > 0) {
        item.hp -= 10
      }
    }
  }
})

// カスタムタグのイベントハンドリング
// 通常では発火しない
<my-icon v-on:click="handleClick"></my-icon>
// .native 修飾子を使用し、発火させる
<my-icon v-on:click.native="handleClick"></my-icon>

// 非親子間の通信(イベントバス)
// インスタンスの初期化時にデータがセットされるよう算出プロパティを使う
var bus = new Vue({
  data: {
    count: 0
  }
})
Vue.component('component-other', {
  template: '<p>bus: {{ bus.count }}</p>',
  computed: {
    // busのデータを算出プロパティに使用する
    bus: function() {
      return bus.$data
    }
  },
  created: function() {
    bus.$on('event-bus', function() {
      this.count++
    })
  }
})

// 親と子両方のデータを受け取る
new Vue({
  data: {
    parentsData: ''
  },
  methods: {
    parentsMethod: function(childsArg, parentsArg) {
      // childsArg => 子のデータ
      // parentsArg => 親のデータ
    }
  }
})

// 名前付きスロット
Vue.component('component-child', {
  template: '<section class="component-child">\
            <slot name="header">default title</slot>\
            <div class="content">\
            <slot>default content</slot>\
            </div>\
            <footer name="footer">\
            </footer>\
            </section>'
})
new Vue({
  el: '#app',
  // components: {
  //   'component-child': componentChild
  // }
})

// スコープ付きスロット
Vue.component('component-child', {
  template: '<div class="props-child">\
            <slot text="Hello, Vue.js"></slot>\
            </div>'
})
new Vue({
  el: '#app'
})

Vue.component('component-child', {
  template: '<ul class="component-child">\
            <slot v-for="item in list" v-bind:item_name="item.name"></slot>\
            </ul>',
  data: function() {
    return {
      list: [
        { id: 1, name: 'スライム', hp: 100},
        { id: 2, name: 'ゴブリン', hp: 200},
        { id: 3, name: 'ドラゴン', hp: 500}
      ]
    }
  }
})
new Vue({
  el: '#app'
})

// 双方向のデータバインディング
Vue.component('my-component', {
  template: '<div class="my-component">\
            <p>名前.{{ name }} HP.{{ hp }}</p>\
            <p>名前 <input v-model="localName"></p>\
            <p>HP <input size="5" v-model.number="localHp"></p>\
            </div>',
  props: {
    name: String,
    hp: Number
  },
  computed: {
    // 算出プロパティのゲッター(取得)とセッター(代入)を使う
    localName: {
      // 値を取得
      get: function() {
        return this.name
      },
      // 値を代入
      set: function(val) {
        this.$emit('update:name', val)
      }
    },
    localHp: {
      // 値を取得
      get: function() {
        return this.hp
      },
      // 値を代入
      set: function(val) {
        this.$emit('update:hp', val)
      }
    }
  }
})
new Vue({
  el: '#app',
  data: {
    name: 'スライム',
    hp: 100
  }
})

// テンプレートの定義方法
Vue.component({
  template: '<p>テンプレート</p>'
})

// EC2015環境下では、テンプレートリテラルでも良い
Vue.component({
  template: `<p>テンプレート</p>`
})

// 描画関数
Vue.component('my-component', {
  render: function(createElement) {
    return createElement('element', { options })
  }
})

// 関数型コンポーネント
Vue.component('functional-component', {
  // function オプションを付ける
  functional: true,
  render: function(createElement, context) {
    return createElement('div', context.props.message)
  },
  props: {
    message: String
  }
})

// 動的コンポーネント
// コンポーネントを定義
Vue.component('my-component-a', {
  template: '<div class="my-component-a">component A</div>'
})
Vue.component('my-component-b', {
  template: '<div class="my-component-b">component B</div>'
})
// 親コンポーネント
// <button v-on:click="current^=1">toggle</button>
// <div v-bind:is="component"></div>
new Vue({
  el: '#app',
  data: {
    componentTypes: ['my-component-a', 'my-component-b'],
    current: 0
  },
  computed: {
    component: function() {
      return this.componentTypes[this.current]
    }
  }
})

// Mixin 共通処理を登録
// Mixin を定義
var mixin = {
  created: function() {
    this.hello()
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!')
    }
  }
}
// Mixin を使用
Vue.component('my-component-a', {
  // Mixin を登録
  mixins: [mixin],
  template: '<p>MyComponentA</p>'
})
Vue.component('my-component-b', {
  // Mixin を登録
  mixins: [mixin],
  template: '<p>MyComponentB</p>'
})
