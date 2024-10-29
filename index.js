const sass = require('sass-embedded');
const path = require('path');

module.exports = (css, settings) => {
	const cssWithPlaceholders = css
		.replace(
			/%%styled-jsx-placeholder-(\d+)%%%(\w*[ ),;!{])/g,
			(_, id, p1) => `styled-jsx-percent-placeholder-${id}-${p1}`
		)
		.replace(
			/%%styled-jsx-placeholder-(\d+)%%(\w*[ ),;!{])/g,
			(_, id, p1) => `styled-jsx-placeholder-${id}-${p1}`
		)
		.replace(
			/%%styled-jsx-placeholder-(\d+)%%%/g,
			(_, id) => `/*%%styled-jsx-percent-placeholder-${id}%%*/`
		)
		.replace(
			/%%styled-jsx-placeholder-(\d+)%%/g,
			(_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
		);

	// Ensure settings.sassOptions is defined
	const sassOptions = settings.sassOptions || {};
	const optionData = sassOptions.data || '';
	const data = optionData + '\n' + cssWithPlaceholders;

	const preprocessed = sass
		.compileString(data, {
			...sassOptions,
			loadPaths: [
				// ...(sassOptions.loadPaths || []),
				...(settings.babel?.filename
					? [path.dirname(settings.babel.filename)]
					: []),
			],
		})
		.css.toString();

	return preprocessed
		.replace(
			/styled-jsx-percent-placeholder-(\d+)-(\w*[ ),;!{])/g,
			(_, id, p1) => `%%styled-jsx-placeholder-${id}%%%${p1}`
		)
		.replace(
			/styled-jsx-placeholder-(\d+)-(\w*[ ),;!{])/g,
			(_, id, p1) => `%%styled-jsx-placeholder-${id}%%${p1}`
		)
		.replace(
			/\/\*%%styled-jsx-percent-placeholder-(\d+)%%\*\//g,
			(_, id) => `%%styled-jsx-placeholder-${id}%%%`
		)
		.replace(
			/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
			(_, id) => `%%styled-jsx-placeholder-${id}%%`
		);
};
