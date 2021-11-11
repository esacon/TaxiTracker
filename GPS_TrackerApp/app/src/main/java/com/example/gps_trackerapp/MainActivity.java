package com.example.gps_trackerapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.github.pires.obd.commands.engine.RPMCommand;
import com.github.pires.obd.commands.protocol.EchoOffCommand;
import com.github.pires.obd.commands.protocol.LineFeedOffCommand;
import com.github.pires.obd.commands.protocol.SelectProtocolCommand;
import com.github.pires.obd.commands.protocol.TimeoutCommand;
import com.github.pires.obd.enums.ObdProtocols;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    private TextView latitudeText;
    private TextView longitudeText;
    private TextView placaText;
    private TextView rpmText;
    private Handler handler;
    private String deviceAddress = "";
    private GpsTracker gpsTracker;
    private MessageSenderUDP msg_udp1;
    private MessageSenderUDP msg_udp2;
    private MessageSenderUDP msg_udp3;
    private MessageSenderUDP msg_udp4;
    private MessageSenderUDP msg_udp5;
    private final int PORT = 8888;
    private BluetoothSocket socket = null;
    private final UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        handler = new Handler();

        // Grant permissions.
        requestPermissions();

        // Get information for sending the message.
        latitudeText = findViewById(R.id.latitudeText);
        longitudeText = findViewById(R.id.longitudeText);
        placaText = findViewById(R.id.placaEditText);
        rpmText = findViewById(R.id.rpmText);

        // Initialize Bluetooth.
        connectBlueTooth();
    }

    public void connectBlueTooth() {

        BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
        Set<BluetoothDevice> pairedDevices = btAdapter.getBondedDevices();

        if (pairedDevices.size() > 0) {
            for (BluetoothDevice device : pairedDevices) {
                if (device.getName().equals("OBDII")) {
                    deviceAddress = device.getAddress();
                }
            }
            if (deviceAddress.isEmpty()) {
                Toast.makeText(getApplicationContext(), "Empareje un dispositivo OBDII.", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(getApplicationContext(), "No hay dispositivos emparejados.", Toast.LENGTH_SHORT).show();
        }

    }

    public void iniciar(View view) {
        // Initialize GPS.
        gpsTracker = new GpsTracker(MainActivity.this);
        if (!deviceAddress.equals("")) {
            try {
                // Iniciar socket de Bluetooth.
                BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
                BluetoothDevice device = btAdapter.getRemoteDevice(deviceAddress);
                socket = device.createRfcommSocketToServiceRecord(uuid);
                socket.connect();
                InputStream io = socket.getInputStream();
                OutputStream ou = socket.getOutputStream();
                Toast.makeText(getApplicationContext(), "Dispositivo OBDII emparejado.", Toast.LENGTH_SHORT).show();
                // Iniciar OBDII.
                new EchoOffCommand().run(io, ou);
                new LineFeedOffCommand().run(io, ou);
                new TimeoutCommand(125).run(io, ou);
                new SelectProtocolCommand(ObdProtocols.AUTO).run(io, ou);
            }  catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
        // Success notification.
        Toast.makeText(getApplicationContext(), "La aplicación ha iniciado.", Toast.LENGTH_LONG).show();
        runnable.run();
    }

    public void detener(View view) {
        // Success notification.
        if (socket != null) {
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Toast.makeText(getApplicationContext(), "La aplicación se ha detenido.", Toast.LENGTH_LONG).show();
        handler.removeCallbacks(runnable);
    }

    public Runnable runnable = new Runnable() {
        public void run() {
            // Initialize UDP protocols.
            msg_udp1 = new MessageSenderUDP("taxi-app.ddns.net", PORT);
            msg_udp2 = new MessageSenderUDP("taxiapp.ddns.net", PORT);
            msg_udp3 = new MessageSenderUDP("taxitrackerapp.ddns.net", PORT);
            msg_udp4 = new MessageSenderUDP("taxiappt2.ddns.net", PORT);
            msg_udp5 = new MessageSenderUDP("taxi-tracker.ddns.net", PORT);
            sendMsg();
            handler.postDelayed(runnable, 5000); // 5 seconds.
        }
    };

    public void sendMsg() {

        // Grant permissions.
        requestPermissions();

        if (checkPermissions()) {

            // Get GPS Location.
            gpsTracker.getLocation();

            if (gpsTracker.canGetLocation()) {

                double latitude = gpsTracker.getLatitude();
                double longitude = gpsTracker.getLongitude();
                long timeStamp = gpsTracker.getTimeStamp();

                int rpm = 0;

                if (socket != null) {
                    RPMCommand engineRpmCommand = new RPMCommand();
                    try {
                        // Obtener revoluciones por minuto.
                        engineRpmCommand.run(socket.getInputStream(), socket.getOutputStream());
                        rpm = engineRpmCommand.getRPM();
                    } catch (IOException | InterruptedException e) {
                        try {
                            socket.close();
                        } catch (IOException ioException) {
                            ioException.printStackTrace();
                        }
                        e.printStackTrace();
                    }
                }

                // Format Message.
                @SuppressLint("DefaultLocale") String message = String.format("%s;%s;%s;%s;%s", latitude, longitude, timeStamp, placaText.getText().toString().trim(), rpm);
                latitudeText.setText(String.format("Latitud:\t%s", latitude));
                longitudeText.setText(String.format("Longitud:\t%s", longitude));
                rpmText.setText(String.format("RPM:\t%s", rpm));
                // Send the message.
                msg_udp1.execute(message);
                msg_udp2.execute(message);
                msg_udp3.execute(message);
                msg_udp4.execute(message);
                msg_udp5.execute(message);

            } else {
                gpsTracker.showSettingsAlert();
            }

        } else {
            Toast.makeText(getApplicationContext(), "Por favor acepte todos los permisos.", Toast.LENGTH_LONG).show();
            requestPermissions();
        }
    }

    private boolean checkPermissions() {
        return ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.INTERNET) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);
        }
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, 1000);
        }
        if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.INTERNET}, 1000);
        }
    }
}