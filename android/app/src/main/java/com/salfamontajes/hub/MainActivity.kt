package com.salfamontajes.hub

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.salfamontajes.hub.databinding.ActivityMainBinding
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var activePortal: PortalModel? = null
    private var portalSwitcherDialog: BottomSheetDialog? = null

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var currentPhotoPath: String? = null

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            launchCameraCapture()
        } else {
            fileUploadCallback?.onReceiveValue(null)
            fileUploadCallback = null
        }
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileUploadCallback == null) return@registerForActivityResult

        var results: Array<Uri>? = null
        if (result.resultCode == RESULT_OK) {
            val data = result.data
            if (data == null || data.data == null) {
                currentPhotoPath?.let {
                    val file = File(it)
                    if (file.exists()) {
                        results = arrayOf(Uri.fromFile(file))
                    }
                }
            } else {
                val dataString = data.dataString
                if (dataString != null) {
                    results = arrayOf(Uri.parse(dataString))
                }
            }
        }
        fileUploadCallback?.onReceiveValue(results)
        fileUploadCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.Theme_PortalesSalfa)
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupHubWebView()
        setupPortalWebView()
        setupNavigationActions()
        setupBackHandler()

        // Cargar el Hub Principal
        val initialUrl = intent.getStringExtra("HUB_URL") ?: PortalManager.getHubUrl()
        binding.hubWebView.loadUrl(initialUrl)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupHubWebView() {
        configureCommonWebSettings(binding.hubWebView.settings)
        binding.hubWebView.addJavascriptInterface(SalfaHubBridge(this), "SalfaHubBridge")

        binding.hubSwipeRefresh.setColorSchemeResources(R.color.salfa_red, R.color.salfa_coral)
        binding.hubSwipeRefresh.setOnRefreshListener {
            binding.hubWebView.reload()
        }

        binding.hubWebView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.hubSwipeRefresh.isRefreshing = false
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Interceptar aperturas de portales pilotos desde el Hub
                for (portal in PortalManager.portales) {
                    if (url.contains(portal.relativePath) || (portal.remoteUrl.isNotEmpty() && url.contains(portal.remoteUrl))) {
                        openPortalInApp(url, portal.nombre, portal.id)
                        return true
                    }
                }

                if (url.startsWith("tel:") || url.startsWith("mailto:")) {
                    try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) {}
                    return true
                }

                return false
            }
        }

        binding.hubWebView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                mWebView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                checkCameraPermissionAndLaunch()
                return true
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupPortalWebView() {
        configureCommonWebSettings(binding.portalWebView.settings)
        binding.portalWebView.addJavascriptInterface(SalfaHubBridge(this), "SalfaHubBridge")

        binding.portalSwipeRefresh.setColorSchemeResources(R.color.salfa_red, R.color.salfa_coral)
        binding.portalSwipeRefresh.setOnRefreshListener {
            binding.portalWebView.reload()
        }

        binding.portalWebView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                binding.portalProgressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.portalProgressBar.visibility = View.GONE
                binding.portalSwipeRefresh.isRefreshing = false
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Si dentro de un portal se pulsa ir al Hub
                if (url.contains("00-portal-hub") || url.endsWith("/portal-hub/")) {
                    closePortalToHub()
                    return true
                }

                // Si dentro de un portal se salta a otro portal
                for (portal in PortalManager.portales) {
                    if (url.contains(portal.relativePath)) {
                        openPortalInApp(url, portal.nombre, portal.id)
                        return true
                    }
                }

                if (url.startsWith("tel:") || url.startsWith("mailto:")) {
                    try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) {}
                    return true
                }

                return false
            }
        }

        binding.portalWebView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                binding.portalProgressBar.progress = newProgress
                if (newProgress >= 100) {
                    binding.portalProgressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                mWebView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                checkCameraPermissionAndLaunch()
                return true
            }
        }
    }

    private fun configureCommonWebSettings(settings: WebSettings) {
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            userAgentString = "$userAgentString SalfaPortalesAndroid/1.0"
        }
    }

    private fun setupNavigationActions() {
        // Botón Volver al Hub
        binding.btnBackToHub.setOnClickListener {
            closePortalToHub()
        }

        // Botón Cambiar Portal (App Switcher BottomSheet)
        binding.btnSwitchPortal.setOnClickListener {
            showPortalSwitcherSheet()
        }

        // Botón Recargar Portal
        binding.btnReloadPortal.setOnClickListener {
            binding.portalWebView.reload()
            Toast.makeText(this, "Actualizando portal...", Toast.LENGTH_SHORT).show()
        }
    }

    fun openPortalInApp(url: String, title: String, portalId: String) {
        activePortal = PortalManager.findById(portalId)

        // Actualizar título en barra superior nativa
        val displayTitle = if (activePortal != null) {
            "[${activePortal?.num}] ${activePortal?.nombre}"
        } else {
            title
        }
        binding.portalTitlePill.text = displayTitle

        // Transición visible hacia el contenedor de portal
        binding.portalContainer.visibility = View.VISIBLE
        binding.portalWebView.loadUrl(url)

        Log.d("SalfaHub", "Navegando in-app al portal: $portalId -> $url")
    }

    fun closePortalToHub() {
        activePortal = null
        binding.portalContainer.visibility = View.GONE
        binding.portalWebView.loadUrl("about:blank")
        Log.d("SalfaHub", "Regresando al Hub Principal")
    }

    private fun showPortalSwitcherSheet() {
        val dialog = BottomSheetDialog(this, R.style.BottomSheetDialogTheme)
        val sheetView = layoutInflater.inflate(R.layout.bottom_sheet_portales, null)
        val container = sheetView.findViewById<LinearLayout>(R.id.portalListContainer)

        for (portal in PortalManager.portales) {
            val itemView = layoutInflater.inflate(R.layout.item_portal_card, container, false)
            val ficha = itemView.findViewById<TextView>(R.id.portalNumFicha)
            val title = itemView.findViewById<TextView>(R.id.portalCardTitle)
            val category = itemView.findViewById<TextView>(R.id.portalCardCategory)

            ficha.text = portal.num
            title.text = portal.nombre
            category.text = portal.categoria

            // Resaltar el portal actualmente activo
            if (activePortal?.id == portal.id) {
                itemView.setBackgroundColor(ContextCompat.getColor(this, R.color.salfa_dark))
            }

            itemView.setOnClickListener {
                dialog.dismiss()
                val targetUrl = PortalManager.resolvePortalUrl(portal)
                openPortalInApp(targetUrl, portal.nombre, portal.id)
            }

            container.addView(itemView)
        }

        portalSwitcherDialog = dialog
        dialog.setContentView(sheetView)
        dialog.show()
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // 1. Si el BottomSheet está abierto, cerrarlo
                if (portalSwitcherDialog?.isShowing == true) {
                    portalSwitcherDialog?.dismiss()
                    return
                }

                // 2. Si estamos dentro de un portal hijo
                if (binding.portalContainer.visibility == View.VISIBLE) {
                    if (binding.portalWebView.canGoBack()) {
                        binding.portalWebView.goBack()
                    } else {
                        // Al llegar a la raíz del portal, volver limpiamente al Hub
                        closePortalToHub()
                    }
                    return
                }

                // 3. Si estamos en el Hub principal
                if (binding.hubWebView.canGoBack()) {
                    binding.hubWebView.goBack()
                } else {
                    showExitDialog()
                }
            }
        })
    }

    private fun showExitDialog() {
        AlertDialog.Builder(this, R.style.Theme_PortalesSalfa)
            .setTitle(R.string.exit_confirm_title)
            .setMessage(R.string.exit_confirm_msg)
            .setPositiveButton(R.string.yes) { _, _ -> finish() }
            .setNegativeButton(R.string.no, null)
            .show()
    }

    private fun checkCameraPermissionAndLaunch() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            launchCameraCapture()
        } else {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun launchCameraCapture() {
        var takePictureIntent: Intent? = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        try {
            val photoFile = createImageFile()
            val photoURI: Uri = FileProvider.getUriForFile(
                this,
                "$packageName.fileprovider",
                photoFile
            )
            takePictureIntent?.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
        } catch (ex: IOException) {
            takePictureIntent = null
        }

        val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
        }

        val intentArray: Array<Intent> = takePictureIntent?.let { arrayOf(it) } ?: emptyArray()

        val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
            putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
            putExtra(Intent.EXTRA_TITLE, "Adjuntar Archivo o Tomar Foto")
            putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
        }

        fileChooserLauncher.launch(chooserIntent)
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(
            "SALFA_HUB_${timeStamp}_",
            ".jpg",
            storageDir
        ).apply {
            currentPhotoPath = absolutePath
        }
    }
}
