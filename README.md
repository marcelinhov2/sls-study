# sls-study

![image](https://user-images.githubusercontent.com/232648/81972044-65c41a00-95f8-11ea-8a9c-be2bc416e351.png)

## First Steps
`git clone`
`yarn install`

## Para rodar local

### Rode em uma aba separada
`serverless offline --stage <STAGE>`

### Para testar o fluxo de coleta e consumo
`sls step-functions-offline --stateMachine=underminer --event=underminer/stepfunction-event.json --stage <STAGE>`

### Para testar uma coleta específica
`serverless invoke local --function <SOURCE> --path underminer/integrations/sources/<SOURCE>/event.json --stage <STAGE>`

## Para fazer deploys
- Configurar o CLI da AWS na máquina
- Adicionar o accountId da AWS no arquivo serverless.yml

`serverless deploy -v --stage <STAGE>`
`serverless invoke --function athenaInit --stage <STAGE>`

## Para inicias a coleta
`serverless invoke local --function ignition --stage <STAGE>`
