import React, { useState, useEffect } from 'react';
import {
    FaFlask,
    FaPlus,
    FaEdit,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaSearch,
    FaTimes,
    FaSave,
    FaCheckCircle,
    FaTimesCircle,
    FaMicroscope,
    FaFilter,
} from 'react-icons/fa';
import useServicesStore from '../stores/servicesStore';
import { getAvailableTests } from '../../../api/services/laboratory.service';

/**
 * Laboratory Services Page - Manage laboratory test services
 * @component
 */
const ServicesPage = () => {
    const {
        services,
        loading,
        error,
        fetchServices,
        createService: createServiceAction,
        updateService: updateServiceAction,
        deleteService: deleteServiceAction,
        toggleServiceAvailability,
        clearError,
    } = useServicesStore();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, available, unavailable
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [availableTests, setAvailableTests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);

    // Add Service Form State
    const [addForm, setAddForm] = useState({
        labTestId: '',
        price: '',
        isAvailable: true,
        labSpecificNotes: '',
    });

    // Edit Service Form State
    const [editForm, setEditForm] = useState({
        price: '',
        labSpecificNotes: '',
    });

    // Fetch services on mount
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Load available tests when add modal opens
    useEffect(() => {
        if (isAddModalOpen) {
            loadAvailableTests();
        }
    }, [isAddModalOpen]);

    // Load available tests
    const loadAvailableTests = async () => {
        setLoadingTests(true);
        try {
            const tests = await getAvailableTests();
            // Filter out tests that are already added
            const existingTestIds = services.map((s) => s.labTestId);
            const filteredTests = tests.filter((t) => !existingTestIds.includes(t.id));
            setAvailableTests(filteredTests);
        } catch (error) {
            console.error('Error loading available tests:', error);
            alert('فشل في تحميل التحاليل المتاحة');
        } finally {
            setLoadingTests(false);
        }
    };

    // Filter services based on search and status
    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.labTestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.labTestCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.labTestCategory?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'available' && service.isAvailable) ||
            (filterStatus === 'unavailable' && !service.isAvailable);

        return matchesSearch && matchesStatus;
    });

    // Handle Add Service
    const handleAddService = async (e) => {
        e.preventDefault();

        if (!addForm.labTestId || !addForm.price) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const result = await createServiceAction({
            labTestId: addForm.labTestId,
            price: parseFloat(addForm.price),
            isAvailable: addForm.isAvailable,
            labSpecificNotes: addForm.labSpecificNotes || undefined,
        });

        if (result.success) {
            setIsAddModalOpen(false);
            setAddForm({
                labTestId: '',
                price: '',
                isAvailable: true,
                labSpecificNotes: '',
            });
            alert('✅ تم إضافة الخدمة بنجاح');
        } else {
            alert(`❌ ${result.error}`);
        }
    };

    // Handle Edit Service
    const handleEditService = async (e) => {
        e.preventDefault();

        if (!editForm.price) {
            alert('يرجى إدخال السعر');
            return;
        }

        const result = await updateServiceAction(selectedService.id, {
            price: parseFloat(editForm.price),
            labSpecificNotes: editForm.labSpecificNotes || undefined,
        });

        if (result.success) {
            setIsEditModalOpen(false);
            setSelectedService(null);
            setEditForm({ price: '', labSpecificNotes: '' });
            alert('✅ تم تحديث الخدمة بنجاح');
        } else {
            alert(`❌ ${result.error}`);
        }
    };

    // Handle Toggle Availability
    const handleToggleAvailability = async (serviceId, currentStatus) => {
        const result = await toggleServiceAvailability(serviceId, !currentStatus);

        if (!result.success) {
            alert(`❌ ${result.error}`);
        }
    };

    // Open Edit Modal
    const openEditModal = (service) => {
        setSelectedService(service);
        setEditForm({
            price: service.price,
            labSpecificNotes: service.labSpecificNotes || '',
        });
        setIsEditModalOpen(true);
    };

    // Handle Delete Service
    const handleDeleteService = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        if (!serviceToDelete) return;

        const result = await deleteServiceAction(serviceToDelete.id);

        if (result.success) {
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
            alert('✅ تم حذف الخدمة بنجاح');
        } else {
            alert(`❌ ${result.error}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1
                        className="text-4xl lg:text-5xl font-black mb-3 leading-tight"
                        style={{
                            background: 'linear-gradient(to right, #00b19f, #00d4be)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        إدارة الخدمات
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        إدارة التحاليل والخدمات المتاحة في المعمل
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaTimesCircle className="text-red-500 text-xl" />
                            <p className="text-red-700 font-semibold">{error}</p>
                        </div>
                        <button onClick={clearError} className="text-red-500 hover:text-red-700">
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* Controls Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="البحث عن خدمة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-12 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-3">
                            <FaFilter className="text-slate-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all font-semibold text-slate-700"
                            >
                                <option value="all">جميع الخدمات</option>
                                <option value="available">متاحة فقط</option>
                                <option value="unavailable">غير متاحة فقط</option>
                            </select>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <FaPlus />
                            <span>إضافة خدمة جديدة</span>
                        </button>
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    /* Loading State */
                    <div className="text-center py-16">
                        <div className="inline-block w-12 h-12 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 font-medium">جاري تحميل الخدمات...</p>
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:border-[#00b19f]/30 transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                            style={{
                                                background: 'linear-gradient(to bottom right, rgba(0, 177, 159, 0.1), rgba(0, 212, 190, 0.1))',
                                            }}
                                        >
                                            <FaMicroscope className="text-xl text-[#00b19f]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">{service.labTestName}</h3>
                                            <p className="text-xs text-slate-500">{service.labTestCode}</p>
                                        </div>
                                    </div>

                                    {/* Availability Toggle */}
                                    <button
                                        onClick={() => handleToggleAvailability(service.id, service.isAvailable)}
                                        className={`text-2xl transition-all duration-200 ${service.isAvailable ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-slate-400'
                                            }`}
                                        title={service.isAvailable ? 'متاحة' : 'غير متاحة'}
                                    >
                                        {service.isAvailable ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>

                                {/* Category */}
                                {service.labTestCategory && (
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                                            {service.labTestCategory}
                                        </span>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="mb-4">
                                    <p className="text-2xl font-black text-[#00b19f]">{service.price.toLocaleString()} ج.م</p>
                                </div>

                                {/* Notes */}
                                {service.labSpecificNotes && (
                                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">{service.labSpecificNotes}</p>
                                    </div>
                                )}

                                {/* Special Instructions */}
                                {service.specialInstructions && (
                                    <div className="mb-4 p-3 bg-amber-50 rounded-lg border-r-2 border-amber-400">
                                        <p className="text-xs font-semibold text-amber-700 mb-1">تعليمات خاصة:</p>
                                        <p className="text-sm text-amber-600">{service.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="mb-4">
                                    {service.isAvailable ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 text-xs font-semibold rounded-lg border border-green-200">
                                            <FaCheckCircle />
                                            متاحة
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200">
                                            <FaTimesCircle />
                                            غير متاحة
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => openEditModal(service)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-all duration-200"
                                    >
                                        <FaEdit />
                                        <span>تعديل</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all duration-200"
                                    >
                                        <FaTrash />
                                        <span>حذف</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
                            style={{
                                background: 'linear-gradient(to bottom right, rgba(0, 177, 159, 0.1), rgba(0, 212, 190, 0.1))',
                            }}
                        >
                            <FaFlask className="text-4xl" style={{ color: '#00b19f' }} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-3">لا توجد خدمات</h3>
                        <p className="text-slate-500 text-base mb-6">
                            {searchTerm || filterStatus !== 'all' ? 'لا توجد نتائج للبحث' : 'ابدأ بإضافة خدمات جديدة لمعملك'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <FaPlus />
                                <span>إضافة خدمة جديدة</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Service Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-black text-slate-800">إضافة خدمة جديدة</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAddService} className="p-6 space-y-6">
                            {/* Select Test */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    التحليل <span className="text-red-500">*</span>
                                </label>
                                {loadingTests ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block w-8 h-8 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-slate-600 text-sm mt-2">جاري تحميل التحاليل...</p>
                                    </div>
                                ) : (
                                    <select
                                        value={addForm.labTestId}
                                        onChange={(e) => setAddForm({ ...addForm, labTestId: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all"
                                    >
                                        <option value="">اختر التحليل</option>
                                        {availableTests.map((test) => (
                                            <option key={test.id} value={test.id}>
                                                {test.name} - {test.code} {test.category && `(${test.category})`}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    السعر (ج.م) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={addForm.price}
                                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                                    required
                                    placeholder="أدخل السعر"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات خاصة بالمعمل</label>
                                <textarea
                                    value={addForm.labSpecificNotes}
                                    onChange={(e) => setAddForm({ ...addForm, labSpecificNotes: e.target.value })}
                                    placeholder="أدخل أي ملاحظات خاصة..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>

                            {/* Availability */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isAvailable"
                                    checked={addForm.isAvailable}
                                    onChange={(e) => setAddForm({ ...addForm, isAvailable: e.target.checked })}
                                    className="w-5 h-5 text-[#00b19f] border-slate-300 rounded focus:ring-[#00b19f]"
                                />
                                <label htmlFor="isAvailable" className="text-sm font-semibold text-slate-700">
                                    الخدمة متاحة
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>جاري الحفظ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            <span>حفظ الخدمة</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {isEditModalOpen && selectedService && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">تعديل الخدمة</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedService.labTestName}</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleEditService} className="p-6 space-y-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    السعر (ج.م) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    required
                                    placeholder="أدخل السعر"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-2">السعر الحالي: {selectedService.price.toLocaleString()} ج.م</p>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات خاصة بالمعمل</label>
                                <textarea
                                    value={editForm.labSpecificNotes}
                                    onChange={(e) => setEditForm({ ...editForm, labSpecificNotes: e.target.value })}
                                    placeholder="أدخل أي ملاحظات خاصة..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>جاري الحفظ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            <span>حفظ التعديلات</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && serviceToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash className="text-2xl text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">حذف الخدمة</h3>
                        <p className="text-slate-600 mb-6">
                            هل أنت متأكد من رغبتك في حذف خدمة <span className="font-bold text-slate-800">"{serviceToDelete.labTestName}"</span>؟
                            <br />
                            لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'جاري الحذف...' : 'نعم، حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
