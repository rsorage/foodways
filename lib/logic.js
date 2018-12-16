/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * @param {info.foodways.RealizarRecebimento} recebimento - Recebimento a ser computado
 * @transaction
 */
async function realizarRecebimento(payload) {
    let carregamento = payload.carregamento;
    if(carregamento.fim) {
        throw Error(`Carregamento ${carregamento.cargId} já finalizado!`);
    }

    if(!carregamento.recebimentos) {
        console.log(`Primeiro recebimento do carregamento ${carregamento.cargId}.`);
        carregamento.recebimentos = [];
    }

    let recebimento = payload.recebimento;
    carregamento.recebimentos.push(recebimento);

    let factory = getFactory();
    let event = factory.newEvent('info.foodways', 'RecebimentoRealizado');

    getAssetRegistry('info.foodways.Carregamento')
        .then(registry => {
            registry.update(carregamento);

            event.origem = recebimento.origem.nome;
            event.quantidade = recebimento.quantidade;
            event.unidadeMedida = recebimento.unidadeMedida;
            emit(event);

            console.log(`Recebimento ${recebimento.recId} adicionado ao carregamento ${carregamento.cargId} com sucesso.`);
        });
}
