const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
	// This is necessary because Figma's 'eval' works differently than normal eval
	context: path.resolve(__dirname),
	devtool: argv.mode === 'production' ? false : 'inline-source-map',
	entry: "./code.ts",
	output: {
		path: path.resolve(__dirname),
		filename: "./code.js"
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".json"],
		fallback: {
			// "process": require.resolve("process/browser"),
			"process": false
		}
	},
	module: {
		rules: [
			// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
			{
				test: /\.tsx?$|\.js?$/,
				loader: 'string-replace-loader',
				options: {
					search: /process\.cwd\(\)/gi,
					replace: '"/"',
					flags: 'g'
				}
			},
			{ test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			// CWD: JSON.stringify("/")
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.CWD': JSON.stringify(process.cwd()),
			// 'process.cwd\(\)': 'window.jQuery'
			// 'process.cwd()': JSON.stringify(process.cwd())
			// 'process.env': {
			// 	NODE_ENV: JSON.stringify("/")
			// },
		}),
	],
	// node: {
	// 	global: false,
	// 	__filename: true,
	// 	__dirname: true,
	// }

});
