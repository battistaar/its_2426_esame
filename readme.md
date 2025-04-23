# Esame 2025

## API server
A partire dalla struttura di questa repo andare a sviluppare le api necessarie a soddisfare le specifiche del file `assignments-def.yaml` (aprire il file con [swagger editor](https://editor.swagger.io/)).

### Descrizione
- L'app permette a un docente di assegnare attività ai suoi studenti e agli studenti di dire se hanno completato l'attività (SI o NO)
- Il docente può creare una classe e assegnare degli utenti di tipo studente alla classe
- All'interno della classe il docente può creare un'attività
- Gli studenti vedono la lista delle classi di cui fanno parte e per ogni classe le attività da fare
- Ogni studente può dichiarare di aver finito l'attività
- Il docente vede solo le classi da lui create e per ogni classe le attività con l'avanzamento del completamento (19/25)

### Indicazioni
- Tutte le api ad eccezione di quelle di autenticazione sono protette tramite token JWT
- Non salvare più dati del necessario nelle collezioni, utilizzare `virtual` e `ref` quando possibile
- La repo ha già una serie di dipendenze dichiarate (penso tutte quelle che vi serviranno)
- Leggere bene le definizioni delle api tramite swagger, contengono campi required, condizioni di errore e descrizioni sul comportamento. ALCUNI COMPORTAMENTI VARIANO A SECONDA DEL RUOLO
- Non abbiate paura di fare copia incolla dal codice scritto a lezione, possibilmente prima accertatevi di averlo capito. Diverso è fare copia incolla da un compagno, non è apprezzato.
- **campo completed**: è visibile solo per gli studenti, determina se l'utente ha già completato l'attività. In questo caso non è possibile (o almeno non semplice) usare un virtual perché bisogna fare il controllo con l'utente che chiama l'API. E' quindi necessario fare l'elaborazione da codice. ATTENZIONE: se si prova ad aggiungere una proprietà a un oggetto di mongoose che non è definita nello schema questa viene eliminata quando viene tornata la risposta, è necessario trasformare prima l'oggetto in plain object (toObject) e aggiungere poi la proprietà
- l'esercizio prevede di avere api "annidate" ( /classroom/{classroomId}/assignment ). Non è nulla di strano, nei router potete definire più parametri e trovate tutti i valori nell'oggetto req.params. E' anche possibile annidare ulteriormente i ruouter se volete organizzare meglio il codice.
- **per la gestione dei ruoli** ci sono due casi:
  - api a cui un tipo di utente non può accedere: gradirei un middleware per fare il controllo a monte
  - api che hanno comportamenti diversi a seconda del ruolo: il controllo e la logica vanno gestiti dal codice (nel controller)
- **assegnazione degli studenti alla classe**: non è un caso che non si possano modificare gli utenti iscritti, è per semplificarvi la vita. Avete bisogno di tenere traccia di chi ha completato un'attività, al momento della creazione prendetevi la lista degli utenti dalla classe e create un nuovo array per la classe con la struttura descritta in seguito. ATTENZIONE: la lista non viene tornata dalle api, tornano solo il conteggio. Usate un virtual
```js
{
  title: "Completare esercizio",
  students: [
    {
      studentId: "id1",
      completed: false
    },
    {
      studentId: "id2",
      completed: false
    }
  ]
  ...
}
```

## APP Angular
Questa va generata usando angular cli, niente codice di partenza. Ricordatevi di generarla con --standalone=false e di configurare il proxy.

### Registrazione e login
- L'app prevede due tipologie di utenti: docente e studente, vedono le stesse pagine ma possono fare azioni diverse.
- La pagina di login è comune, sia il docente che lo studente poi vanno alla lista delle classi a cui possono accedere:
  - Il docente vedrà le classi che ha creato
  - Lo studente vedrà le classi di cui fa parte
- La pagina di registrazione è la stessa, oltre ai campi classici l'utente decide se registrarsi come docente o come studente
- L'app prevede una navbar con l'utente loggato o il pulsante di login
- Tutte le pagine richiedono autenticazione

### Lista classi
- La pagina presenta una lista con il nome della classe, il nome del docente che l'ha creata e il numero di studenti che ne fanno parte
- Il docente ha a disposizione anche un pulsante di aggiunta tramite il quale può andare a creare una nuova classe:
  - Per creare una classe è necessario darle un nome e selezionare gli studenti che ne fanno parte. Una volta creata non è modificabile
- Premendo su una delle classi sia studenti che docenti entrano nella pagina delle attività

### Pagina attività (o pagina della classe)
- Questa pagina presenta una lista di tutte le attività create. Ogni elemento prevede:
  - Descrizione dell'attività
  - Data di creazione dell'attività
  - Numero di studenti che l'hanno completata rispetto al totale
  - Un pulsante di completamento (visibile solo agli studenti se non hanno ancora completato l'attività)
- Ogni utente può accedere a questa pagina solo se è il docente che ha creato la classe o se è uno studente iscritto a questa classe.

### Bonus (punti extra)
- Dare la possibilità al docente, premendo sull'attività, di vedere gli studenti che hanno o non hanno completato l'attività
- Registrare, oltre al completamento, anche la data di completamento

### Indicazioni generali
- Installare e utilizzare ngboostrap e i suoi componenti (documentazione del corso)
- Aggiungere la navbar alla pagina con l'utente loggato e il logout (come fatto in classe)
- Controllate bene nelle api quali dati devono essere mandati e quali sono obbligatori o opzionali.
- Non vi preoccupate troppo dello stile, ma datemi almeno l'impressione di averci provato
- Guardate bene la documentazione di [ng-bootstrap](https://ng-bootstrap.github.io/) e cercate componenti che vi possano essere utili
- Guardate in particolare gli esempi e cercate di capire dalle api della libreria se ci sono delle configurazioni da applicare per ottenere i risultati che desiderate
- Suddividete quanto più possibile in componenti, se un comportamento si ripete fare in modo di avere qualcosa di riutilizzabile
- Non abbiate paura di fare copia incolla dal codice scritto a lezione, possibilmente prima accertatevi di averlo capito. Diverso è fare copia incolla da un compagno, non è apprezzato.
- **per il controllo dei ruoli** potete creare una direttiva simile a *ifAuthenticated se ve la sentite, ma va bene anche gestire tutto semplicemente dal codice della pagina. Non ci sono penalizzazioni.