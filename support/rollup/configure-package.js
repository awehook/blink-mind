import rollupTs from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import cssPorter from 'rollup-plugin-css-porter';
import path from 'path';

function configure(pkg, env, target) {
  const projectDir = path.join(__filename, '..');
  const packagesDir = path.join(projectDir, 'packages');
  const resolvePackage = p => path.resolve(packagesDir, p);
  const tsconfig = path.resolve(projectDir, `tsconfig.json`);
  // const isProd = env === 'production';
  // const isUmd = target === 'umd';
  const isModule = target === 'module';
  const pkgDir = pkg.name.substr('@blink-mind/'.length);
  const input = resolvePackage(`${pkgDir}/src/index.ts`);
  // console.log('input:', input);
  const deps = []
    .concat(pkg.dependencies ? Object.keys(pkg.dependencies) : [])
    .concat(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []);


  const plugins = [
    // resolve({
    //   browser: true
    // }),
    rollupTs({
      abortOnError: false,
      tsconfig: `./packages/${pkgDir}/tsconfig.json`,
      clean: true
    }),
    commonjs({
      exclude: [`packages/${pkgDir}/src/**`],
      namedExports: {
        'node_modules/react/index.js': [
          'cloneElement',
          'createContext',
          'Component',
          'createElement'
        ],
        // 'node_modules/react-dom/index.js': ['render', 'hydrate'],
        'node_modules/react-is/index.js': [
          'isElement',
          'isValidElementType',
          'ForwardRef'
        ]
      }
    }),

    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    cssPorter()
    // rollupTs({ typescript, tsconfig })
  ];

  if (isModule) {
    return {
      plugins,
      input,
      output: [
        {
          file: `packages/${pkgDir}/${pkg.module}`,
          format: 'es',
          sourcemap: true
        },
        {
          file: `packages/${pkgDir}/${pkg.main}`,
          format: 'cjs',
          exports: 'named',
          sourcemap: true
        }
      ],
      external: id => {
        // console.log('external:',id);
        return !!deps.find(dep => dep === id || id.startsWith(`${dep}/`));
      }
    };
  }
}

function configurePackage(pkg) {
  return [configure(pkg, 'development', 'module')];
}

export default configurePackage;
