export const getHostEnvironment = () =>
    JSON.parse(window.__adobe_cep__.getHostEnvironment());

export const evalJsxScript = (method, ...params) =>
    new Promise(resolve => {
        const stringifiedParams = params
            .reduce((prev, param) => {
                switch (typeof param) {
                    case 'object':
                        return `${prev},${JSON.stringify(param)}`;
                    default:
                        return `${prev},'${param.replace(/\\/g, '\\\\')}'`;
                }
            }, '')
            .substring(1);
        console.log(`$._PPP_.${method}(${stringifiedParams})`);
        window.__adobe_cep__.evalScript(
            `$._PPP_.${method}(${stringifiedParams})`,
            (...callbackParams) => {
                const stringifiedCallbackParams = callbackParams.map(param => {
                    let result = param;
                    switch (typeof param) {
                        case 'string':
                            try {
                                const json = JSON.parse(param);
                                result = json;
                            } catch {}
                            if (!isNaN(result)) {
                                result = Number(result);
                            }
                            break;
                        default:
                    }
                    return result;
                });
                resolve(stringifiedCallbackParams);
            }
        );
    });