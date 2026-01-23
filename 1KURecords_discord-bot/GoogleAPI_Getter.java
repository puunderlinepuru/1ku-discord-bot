package com.example.demo.Misc;

import com.example.demo.Misc.GoogleAPI_Java_Tutorial;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.UpdateValuesResponse;
import com.google.api.services.sheets.v4.model.ValueRange;

import java.io.*;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.util.*;

public class GoogleAPI_Getter {

    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    /**
     * Global instance of the scopes required by this quickstart.
     * If modifying these scopes, delete your previously saved tokens/ folder.
     */
    private static final List<String> SCOPES =
            Collections.singletonList(SheetsScopes.SPREADSHEETS);
    private static final String CREDENTIALS_FILE_PATH = "/GoogleAPI_Desktop_secret.json";

    /**
     * Creates an authorized Credential object.
     *
     * @param HTTP_TRANSPORT The network HTTP Transport.
     * @return An authorized Credential object.
     * @throws IOException If the credentials.json file cannot be found.
     */
    private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT)
            throws IOException {
        // Load client secrets.
        InputStream in = GoogleAPI_Getter.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Credentials resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    public static void startTasks() throws IOException, GeneralSecurityException {

//        Show_Directories_And_Files.printFiles();

        // Build a new authorized API client service.
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        final String testSpreadsheetID = "1a09PuBN2hnJ58c8km_la3e0_sUAjQ8HatalX7fdMl50";

//        https://docs.google.com/spreadsheets/d/1cxxyzz0SDWCj8wI6QwN66SOtbpedrf2DWXrH6io2ZNk/edit?gid=0#gid=0
        final String uncletopiaSpreadsheetID = "1cxxyzz0SDWCj8wI6QwN66SOtbpedrf2DWXrH6io2ZNk"; // Actual

//        https://docs.google.com/spreadsheets/d/11IRxK5JLbdaUgrMtSZrFQl_EjvdoKTuq4xWV_qPau7s
//        final String uncletopiaSpreadsheetID = "11IRxK5JLbdaUgrMtSZrFQl_EjvdoKTuq4xWV_qPau7s"; // Backup copy from Nov 17
        final String range = "Sheet1!A1";

        List<List<Object>> valuesToPost = new ArrayList<>();
        String[] inletValues = {"Another update"};
        valuesToPost.add(List.of(inletValues));

        Sheets service =
                new Sheets.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                        .setApplicationName(APPLICATION_NAME)
                        .build();

        UpdateValuesResponse result = null;
        String valueInputOption = "RAW";

        Timer timer = new Timer();
        TimerTask timerTask = new Update_Task(uncletopiaSpreadsheetID, result, valueInputOption, valuesToPost, service);
        timer.schedule(timerTask, 200, 3600000);
    }

    GoogleAPI_Getter() throws GeneralSecurityException, IOException {
        startTasks();
    }


    public static void main(String... args) throws GeneralSecurityException, IOException {
        startTasks();
    }
}

class Update_Task extends TimerTask {
    UpdateValuesResponse result;
    String valueInputOption;
    Sheets service;
    String spreadsheetId;
    List<List<Object>> valuesToPost;

    List<List<Object>> values;

    private static final Set<String> gamemodes = Set.of("capture point", "territory control", "capture the flag", "koth", "payload");
    Update_Task(String spreadSheetId, UpdateValuesResponse result, String valueInputOption, List<List<Object>> valuesToPost, Sheets service){
        this.spreadsheetId = spreadSheetId;
        this.result = result;
        this.valueInputOption = valueInputOption;
        this.valuesToPost = valuesToPost;
        this.service = service;
    }
    public void run() {
        readSheets();
        processResponse();
//        updateSheets();
    }

    protected void readSheets() {
        try {
            ValueRange response = service.spreadsheets().values()
                    .get(spreadsheetId, "Any%!A2:G53")
//                    .get(spreadsheetId, "Sheet1!D2")
                    .execute();
            values = response.getValues();
            if (values == null || values.isEmpty()) {
                System.out.println("No data found.");
            }
        } catch (Exception ex) {
            try {
                throw ex;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    protected void processResponse() {
//      values are [A1, B1], [A2, B2]
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonNode = objectMapper.createObjectNode();



//        Map name
        String tempData = values.get(0).get(0).toString();

        for (int i = 0; i < values.size(); i++) {
            if (values.get(i).toArray().length > 3) {
                ObjectNode mapNode = objectMapper.createObjectNode();
                mapNode.put("curr", (String) values.get(i).get(1));
                mapNode.put("prev", (String) values.get(i).get(2));
                mapNode.put("pic", (String) values.get(i).get(3));
                jsonNode.set((String) values.get(i).get(0), mapNode);
            }
            System.out.println(values.get(i));
            if (values.get(i).toArray().length < 4 && !gamemodes.contains(values.get(i).get(0))) {
                System.out.println("error in element " + values.get(i) + " at " + i);
            }
        }

        System.out.println(values.size());

        try {
            objectMapper
                    .writerWithDefaultPrettyPrinter()
//                    .writeValue(new File(this.getClass().getResource("/records.json").getPath()), jsonNode);
                    .writeValue(new File("D:/1kU website/1ku-discord-bot/1KURecords_discord-bot/records.json"), jsonNode);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected void updateSheets() {
        try {
            // Updates the values in the specified range.
            ValueRange body = new ValueRange()
                    .setValues(values);
            result = service.spreadsheets().values().update(spreadsheetId, "Sheet1!A2", body)
                    .setValueInputOption(valueInputOption)
                    .execute();
            System.out.printf("%d cells updated.\n", result.getUpdatedCells());
        } catch (GoogleJsonResponseException e) {
            // TODO(developer) - handle error appropriately
            GoogleJsonError error = e.getDetails();
            if (error.getCode() == 404) {
                System.out.printf("Spreadsheet not found with id '%s'.\n", spreadsheetId);
            } else {
                try {
                    throw e;
                } catch (GoogleJsonResponseException ex) {
                    throw new RuntimeException(ex);
                }
            }
        } catch (Exception ex) {
            try {
                throw ex;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}